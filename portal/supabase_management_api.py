#!/usr/bin/env python3
"""
Supabase Management API経由でテーブル作成
"""
import os
import json
import urllib.request
import urllib.parse
import sys

# 環境変数読み込み
def load_env_from_file():
    env_path = '.env.local'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        value = value.strip('"')
                        os.environ[key] = value

load_env_from_file()

# Supabase設定
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SECRET_KEY = os.environ.get('SUPABASE_SECRET_KEY')

# プロジェクトrefを抽出
if SUPABASE_URL:
    project_ref = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
    print(f"🔍 プロジェクトref: {project_ref}")
else:
    print("❌ SUPABASE_URL が設定されていません")
    sys.exit(1)

def execute_sql_via_management_api(sql_query):
    """Management API経由でSQL実行"""
    try:
        url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"
        
        data = json.dumps({
            'query': sql_query,
            'read_only': False
        }).encode('utf-8')
        
        # Management API アクセス用のヘッダー
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {SUPABASE_SECRET_KEY}',  # Secret keyを試す
            'Accept': 'application/json'
        }
        
        req = urllib.request.Request(url, data=data, headers=headers)
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return {'success': True, 'data': result}
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {'success': False, 'error': f'HTTP {e.code}: {error_body}', 'code': e.code}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def create_tables_via_management_api():
    """Management API経由でテーブル作成"""
    print("🚀 Supabase Management API経由でテーブル作成開始...\n")
    
    # SQL読み込み
    sql_file = 'create-tables-sql.sql'
    if not os.path.exists(sql_file):
        print(f"❌ SQLファイルが見つかりません: {sql_file}")
        return False
    
    with open(sql_file, 'r') as f:
        sql_content = f.read()
    
    print("📋 SQL実行中...")
    print("=" * 50)
    print(sql_content[:200] + "..." if len(sql_content) > 200 else sql_content)
    print("=" * 50)
    
    result = execute_sql_via_management_api(sql_content)
    
    if result['success']:
        print("✅ テーブル作成成功！")
        print(f"結果: {result['data']}")
        return True
    else:
        print(f"❌ テーブル作成失敗: {result['error']}")
        
        # エラーコードに応じた対応
        if result.get('code') == 401:
            print("\n💡 認証エラー: Management API用のアクセストークンが必要かもしれません")
            print("📋 手動セットアップ手順:")
            print("1. https://supabase.com/dashboard にアクセス")
            print("2. プロジェクト選択 → SQL Editor")
            print("3. create-tables-sql.sql の内容をコピー&実行")
        elif result.get('code') == 404:
            print("\n💡 プロジェクト参照エラー: プロジェクトrefが正しくない可能性があります")
        
        return False

def insert_lead_magnets():
    """リードマグネットデータ挿入"""
    print("\n📋 リードマグネットデータ挿入中...")
    
    # データ挿入のSQL
    insert_sql = """
INSERT INTO public.packs (id, title, description, file_url, file_size, is_premium, tags) VALUES
(
  'ai-video-starter-kit-2025',
  '🎬 AI動画作成スターターキット',
  '1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。',
  '../lead_magnets/1_ai_video_starter_kit.html',
  147000,
  false,
  ARRAY['AI動画', '台本テンプレート', '7日間計画', '収益化', 'YouTube']
),
(
  'kindle-master-guide-2025',
  '📚 Kindle出版完全攻略ガイド',
  '30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。',
  '../lead_magnets/2_kindle_master_guide.html',
  132000,
  false,
  ARRAY['Kindle出版', 'KDP', 'AI活用', '30日計画', '電子書籍']
),
(
  'blog-templates-collection-2025',
  '📝 ブログ収益化テンプレート集',
  '月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。',
  '../lead_magnets/3_blog_templates/templates.md',
  89000,
  false,
  ARRAY['ブログ', 'SEO', 'アフィリエイト', 'テンプレート', '収益化']
),
(
  'ai-prompts-sidebusiness-50-2025',
  '🤖 AIプロンプト集（副業特化50選）',
  '動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。',
  '../lead_magnets/4_prompts_50/prompts.md',
  76000,
  false,
  ARRAY['AIプロンプト', 'ChatGPT', '副業', '50選', 'テンプレート']
),
(
  'roadmap-90days-30k-2025',
  '🎯 月3万円達成90日ロードマップ',
  '継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。',
  '../lead_magnets/5_90day_roadmap/roadmap.md',
  95000,
  false,
  ARRAY['90日計画', '月3万円', 'ロードマップ', '目標管理', '副業']
),
(
  'time-management-sidebusiness-2025',
  '⏰ 副業時間管理術',
  '週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。',
  '../lead_magnets/6_time_management/guide.md',
  64000,
  true,
  ARRAY['時間管理', '習慣化', '自動化', '両立術', 'プレミアム']
)
ON CONFLICT (id) DO NOTHING;
"""
    
    result = execute_sql_via_management_api(insert_sql)
    
    if result['success']:
        print("✅ リードマグネットデータ挿入成功！")
        return True
    else:
        print(f"❌ データ挿入失敗: {result['error']}")
        return False

def verify_setup():
    """セットアップ確認"""
    print("\n🔍 セットアップ確認中...")
    
    verify_sql = "SELECT id, title, is_premium FROM public.packs ORDER BY created_at;"
    
    result = execute_sql_via_management_api(verify_sql)
    
    if result['success']:
        data = result['data']
        if isinstance(data, list) and len(data) > 0:
            print(f"✅ 確認完了: {len(data)}個のリードマグネットが登録されています")
            for i, pack in enumerate(data, 1):
                premium_badge = "💎" if pack.get('is_premium') else "🆓"
                print(f"  {i}. {premium_badge} {pack.get('title', 'Unknown')}")
            return True
        else:
            print("⚠️ データが見つかりませんでした")
            return False
    else:
        print(f"❌ 確認失敗: {result['error']}")
        return False

def main():
    """メイン処理"""
    # 1. テーブル作成
    if not create_tables_via_management_api():
        print("\n❌ テーブル作成に失敗しました")
        return False
    
    # 2. データ挿入
    if not insert_lead_magnets():
        print("\n❌ データ挿入に失敗しました")
        return False
    
    # 3. 確認
    if not verify_setup():
        print("\n❌ セットアップ確認に失敗しました")
        return False
    
    print("\n🎉 Supabaseデータベースセットアップ完了！")
    print("✅ 次のステップ: Vercelポータルサイトで動作確認")
    return True

if __name__ == "__main__":
    success = main()
    
    if not success:
        print("\n❌ セットアップに問題がありました")
        print("📋 手動セットアップを実行してください:")
        print("1. https://supabase.com/dashboard にアクセス")
        print("2. プロジェクト選択 → SQL Editor")
        print("3. create-tables-sql.sql の内容をコピー&実行")
        sys.exit(1)