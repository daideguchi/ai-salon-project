#!/usr/bin/env python3
"""
AI在宅ワーク研究所 ポータル: Supabaseテーブル自動作成スクリプト（総合版）

特徴
- 3つのアプローチでSQL実行を試行し、自動フォールバック
  1) PostgREST RPC 関数（例: exec_sql / execute_sql / sql）
  2) pg-meta の executeSql API（複数候補エンドポイント）
  3) Platform Management API エンドポイント
- 既存テーブルの存在検知と安全な再実行
- 6つのリードマグネット初期データの自動投入（重複はスキップ）
- .env.local から環境変数を読込
- 本番運用を想定した詳細ロギング

前提
- .env.local に以下が設定されていること
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY（任意）
  - SUPABASE_SECRET_KEY（service_role）
  - SUPABASE_ACCESS_TOKEN（任意: Platform API 用の PAT）

使い方
- python3 supabase_setup_all_paths.py
"""
import os
import sys
import json
import time
import logging
import urllib.request
import urllib.error
from typing import Any, Dict, Optional, Tuple, List


# -------------------------
# Logging
# -------------------------
def setup_logger() -> logging.Logger:
    logger = logging.getLogger("supabase_setup")
    if logger.handlers:
        return logger

    level = os.environ.get("LOG_LEVEL", "INFO").upper()
    level_num = getattr(logging, level, logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    logger.setLevel(level_num)
    logger.addHandler(handler)
    logger.propagate = False
    return logger


log = setup_logger()


# -------------------------
# Env loader
# -------------------------
def load_env_from_file(path: str = ".env.local") -> None:
    if not os.path.exists(path):
        log.warning(".env.local が見つかりませんでした。環境変数が直接設定されている想定で続行します。")
        return
    with open(path, "r", encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            value = value.strip().strip("\'").strip('"')
            os.environ.setdefault(key, value)


load_env_from_file()


# -------------------------
# Config
# -------------------------
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY")
SUPABASE_ACCESS_TOKEN = os.environ.get("SUPABASE_ACCESS_TOKEN")  # Prefer for Platform API

SQL_FILE = "create-tables-sql.sql"  # TEXT主キー版（packs.id が文字列）


def require_env() -> None:
    missing = []
    if not SUPABASE_URL:
        missing.append("NEXT_PUBLIC_SUPABASE_URL")
    if not SUPABASE_SECRET_KEY:
        missing.append("SUPABASE_SECRET_KEY")
    if missing:
        for k in missing:
            log.error(f"環境変数未設定: {k}")
        raise SystemExit(1)


def project_ref_from_url(url: str) -> Optional[str]:
    try:
        host = url.replace("https://", "").replace("http://", "").split("/")[0]
        # {ref}.supabase.co → {ref}
        if host.endswith(".supabase.co"):
            return host.replace(".supabase.co", "")
        return None
    except Exception:
        return None


PROJECT_REF = project_ref_from_url(SUPABASE_URL) if SUPABASE_URL else None


# -------------------------
# HTTP utils
# -------------------------
def http_json(
    method: str,
    url: str,
    headers: Dict[str, str],
    data: Optional[Dict[str, Any]] = None,
    timeout: int = 30,
) -> Tuple[int, Optional[Dict[str, Any]], Optional[str]]:
    body_bytes = None
    hdrs = dict(headers or {})
    if data is not None:
        body_bytes = json.dumps(data).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/json")
        hdrs["Content-Length"] = str(len(body_bytes))
    req = urllib.request.Request(url, data=body_bytes, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            txt = raw.decode("utf-8") if raw else ""
            try:
                return resp.status, (json.loads(txt) if txt else None), None
            except json.JSONDecodeError:
                return resp.status, None, txt
    except urllib.error.HTTPError as e:
        raw = e.read()
        txt = raw.decode("utf-8") if raw else ""
        return e.code, None, txt
    except Exception as e:
        return 0, None, str(e)


# -------------------------
# Checks and helpers
# -------------------------
def read_sql_file(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"SQLファイルが見つかりません: {path}")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    # 依存拡張の自動補完（uuid_generate_v4 使用時）
    if "uuid_generate_v4()" in content and "uuid-ossp" not in content:
        prefix = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n'
        content = prefix + content
    return content


def packs_table_exists() -> bool:
    url = f"{SUPABASE_URL}/rest/v1/packs?select=id&limit=1"
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Accept": "application/json",
    }
    code, data, err = http_json("GET", url, headers)
    if code == 200:
        log.info("packs テーブルは既に存在します（REST確認に成功）")
        return True
    if code == 404:
        log.info("packs テーブルが存在しません（RESTは404）")
        return False
    log.warning(f"packs テーブル確認に失敗: status={code} error={err}")
    return False


# -------------------------
# Approach 1: RPC 関数で SQL 実行
# -------------------------
RPC_CANDIDATES = [
    "exec_sql",
    "execute_sql",
    "sql",
]


def try_rpc_execute(sql: str) -> bool:
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
    }
    for fn in RPC_CANDIDATES:
        endpoint = f"{SUPABASE_URL}/rest/v1/rpc/{fn}"
        payload = {"query": sql}
        log.info(f"[RPC] 試行: {endpoint}")
        code, data, err = http_json("POST", endpoint, headers, payload)
        if 200 <= code < 300:
            log.info(f"[RPC] 成功: {fn}")
            return True
        log.warning(f"[RPC] 失敗: fn={fn} status={code} error={err}")
    return False


# -------------------------
# Approach 2: pg-meta executeSql で SQL 実行（複数候補エンドポイント）
# -------------------------
PG_META_ENDPOINT_CANDIDATES: List[Tuple[str, str]] = [
    ("POST", "/pg/meta/query"),
    ("POST", "/pg/meta/executeSql"),
    ("POST", "/pg/meta"),
]


def try_pg_meta_execute(sql: str) -> bool:
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
    }
    # 軽いヘルスチェック（任意）
    health_url = f"{SUPABASE_URL}/pg/meta/health"
    code, _, _ = http_json("GET", health_url, headers)
    log.info(f"[pg-meta] health: status={code}")

    for method, path in PG_META_ENDPOINT_CANDIDATES:
        endpoint = f"{SUPABASE_URL}{path}"
        payload = {"query": sql}
        log.info(f"[pg-meta] 試行: {method} {endpoint}")
        code, data, err = http_json(method, endpoint, headers, payload)
        if 200 <= code < 300:
            log.info("[pg-meta] 成功")
            return True
        log.warning(f"[pg-meta] 失敗: status={code} error={err}")
    return False


# -------------------------
# Approach 3: Platform Management API エンドポイントで SQL 実行
# -------------------------
def try_platform_api_execute(sql: str) -> bool:
    if not PROJECT_REF:
        log.error("Platform API: PROJECT_REF を URL から抽出できませんでした")
        return False

    # Platform API は PAT を推奨。なければ service_role を最後の手段として試す。
    token = SUPABASE_ACCESS_TOKEN or SUPABASE_SECRET_KEY
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }

    # 候補エンドポイント（仕様差分に対応）
    candidates = [
        ("POST", f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query", {"query": sql, "read_only": False}),
        ("POST", f"https://api.supabase.com/v1/projects/{PROJECT_REF}/sql", {"sql": sql}),
    ]

    for method, url, payload in candidates:
        log.info(f"[Platform] 試行: {method} {url}")
        code, data, err = http_json(method, url, headers, payload)
        if 200 <= code < 300:
            log.info("[Platform] 成功")
            return True
        log.warning(f"[Platform] 失敗: status={code} error={err}")
    return False


# -------------------------
# Seed: 6リードマグネットの挿入
# -------------------------
LEAD_MAGNETS = [
    {
        "id": "ai-video-starter-kit-2025",
        "title": "🎬 AI動画作成スターターキット",
        "description": "1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。",
        "file_url": "../lead_magnets/1_ai_video_starter_kit.html",
        "file_size": 147000,
        "is_premium": False,
        "tags": ["AI動画", "台本テンプレート", "7日間計画", "収益化", "YouTube"],
    },
    {
        "id": "kindle-master-guide-2025",
        "title": "📚 Kindle出版完全攻略ガイド",
        "description": "30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。",
        "file_url": "../lead_magnets/2_kindle_master_guide.html",
        "file_size": 132000,
        "is_premium": False,
        "tags": ["Kindle出版", "KDP", "AI活用", "30日計画", "電子書籍"],
    },
    {
        "id": "blog-templates-collection-2025",
        "title": "📝 ブログ収益化テンプレート集",
        "description": "月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。",
        "file_url": "../lead_magnets/3_blog_templates/templates.md",
        "file_size": 89000,
        "is_premium": False,
        "tags": ["ブログ", "SEO", "アフィリエイト", "テンプレート", "収益化"],
    },
    {
        "id": "ai-prompts-sidebusiness-50-2025",
        "title": "🤖 AIプロンプト集（副業特化50選）",
        "description": "動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。",
        "file_url": "../lead_magnets/4_prompts_50/prompts.md",
        "file_size": 76000,
        "is_premium": False,
        "tags": ["AIプロンプト", "ChatGPT", "副業", "50選", "テンプレート"],
    },
    {
        "id": "roadmap-90days-30k-2025",
        "title": "🎯 月3万円達成90日ロードマップ",
        "description": "継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。",
        "file_url": "../lead_magnets/5_90day_roadmap/roadmap.md",
        "file_size": 95000,
        "is_premium": False,
        "tags": ["90日計画", "月3万円", "ロードマップ", "目標管理", "副業"],
    },
    {
        "id": "time-management-sidebusiness-2025",
        "title": "⏰ 副業時間管理術",
        "description": "週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。",
        "file_url": "../lead_magnets/6_time_management/guide.md",
        "file_size": 64000,
        "is_premium": True,
        "tags": ["時間管理", "習慣化", "自動化", "両立術", "プレミアム"],
    },
]


def seed_lead_magnets() -> Tuple[int, int]:
    url = f"{SUPABASE_URL}/rest/v1/packs"
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    ok, fail = 0, 0
    for item in LEAD_MAGNETS:
        code, _, err = http_json("POST", url, headers, item)
        if code == 201:
            log.info(f"[seed] 追加: {item['title']}")
            ok += 1
        elif code == 409:
            log.info(f"[seed] 既存: {item['title']}（スキップ）")
            ok += 1
        else:
            log.error(f"[seed] 失敗: {item['title']} status={code} err={err}")
            fail += 1
    return ok, fail


def verify_seed() -> bool:
    url = f"{SUPABASE_URL}/rest/v1/packs?select=id,title,is_premium&order=created_at"
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "Accept": "application/json",
    }
    code, data, err = http_json("GET", url, headers)
    if code == 200 and isinstance(data, list):
        log.info(f"[verify] 登録済み: {len(data)} 件")
        for i, row in enumerate(data, 1):
            badge = "💎" if row.get("is_premium") else "🆓"
            log.info(f"  {i}. {badge} {row.get('title')}")
        return True
    log.error(f"[verify] 確認失敗: status={code} err={err}")
    return False


# -------------------------
# Orchestrator
# -------------------------
def run_sql_with_fallbacks(sql: str) -> bool:
    log.info("SQLを3アプローチで実行します（フォールバック有り）")
    # 1) RPC 関数
    if try_rpc_execute(sql):
        return True
    # 2) pg-meta
    if try_pg_meta_execute(sql):
        return True
    # 3) Platform API
    if try_platform_api_execute(sql):
        return True
    return False


def main() -> int:
    require_env()
    log.info("===== Supabase セットアップ開始 =====")
    log.info(f"URL: {SUPABASE_URL}")
    if PROJECT_REF:
        log.info(f"Project Ref: {PROJECT_REF}")
    else:
        log.warning("Project Ref を URL から抽出できませんでした（Platform API はスキップされる場合があります）")

    # テーブル存在チェック
    if packs_table_exists():
        log.info("スキーマ作成はスキップ（既存検知）")
    else:
        sql = read_sql_file(SQL_FILE)
        # 実行
        if not run_sql_with_fallbacks(sql):
            log.error("全アプローチで SQL 実行に失敗しました。手動で SQL を適用してください。")
            log.error(f"SQL ファイル: {SQL_FILE}")
            return 2
        log.info("スキーマ作成に成功しました。")

    # シード投入
    log.info("リードマグネットの初期データを投入します…")
    ok, fail = seed_lead_magnets()
    log.info(f"Seed 結果: 成功 {ok} 件 / 失敗 {fail} 件")
    if fail > 0:
        log.warning("一部のデータ投入に失敗しました。権限・RLS・スキーマをご確認ください。")

    # 検証
    if verify_seed():
        log.info("===== セットアップ完了 =====")
        return 0
    else:
        log.error("データ確認に失敗しました。アプリからの参照設定やRLSをご確認ください。")
        return 3


if __name__ == "__main__":
    rc = main()
    sys.exit(rc)
