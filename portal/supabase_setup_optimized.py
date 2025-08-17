#!/usr/bin/env python3
"""
Supabase最適化セットアップ - 複数アプローチによるデータベース構築
"""
import os
import json
import urllib.request
import urllib.parse
import urllib.error
import sys
from typing import Dict, Any, Optional

def load_env_variables():
    """環境変数読み込み"""
    env_path = '.env.local'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value.strip('"')

# 環境変数読み込み
load_env_variables()

# Supabase設定
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUPABASE_SECRET_KEY = os.environ.get('SUPABASE_SECRET_KEY')

def make_supabase_request(endpoint: str, method: str = 'GET', data: Optional[Dict] = None, use_secret_key: bool = True) -> Dict[str, Any]:
    """Supabase APIリクエスト共通関数"""
    try:
        url = f"{SUPABASE_URL}{endpoint}"
        
        # ヘッダー設定
        headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SECRET_KEY if use_secret_key else SUPABASE_ANON_KEY,
            'Authorization': f'Bearer {SUPABASE_SECRET_KEY if use_secret_key else SUPABASE_ANON_KEY}',
        }
        
        # リクエストデータ
        request_data = None
        if data:
            request_data = json.dumps(data).encode('utf-8')
            headers['Content-Length'] = str(len(request_data))
        
        # リクエスト作成
        req = urllib.request.Request(url, data=request_data, headers=headers, method=method)
        
        # リクエスト実行
        with urllib.request.urlopen(req, timeout=30) as response:
            result = response.read().decode()
            return {
                'success': True,
                'status_code': response.status,
                'data': json.loads(result) if result else None
            }
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {
            'success': False,
            'status_code': e.code,
            'error': error_body,
            'error_type': 'http'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'error_type': 'general'
        }

def check_table_exists() -> bool:
    """テーブル存在確認"""
    print("📦 packsテーブル存在確認...")
    
    # 1. 直接データ取得試行
    result = make_supabase_request('/rest/v1/packs?limit=1')
    
    if result['success']:
        print("✅ packsテーブルが存在します")
        return True
    elif result['status_code'] == 404:
        print("❌ packsテーブルが存在しません")
        return False
    else:
        print(f"⚠️ テーブル確認エラー: {result['error']}")
        return False

def create_test_pack() -> bool:
    """テストパック作成でテーブル存在確認"""
    test_pack = {
        'id': 'test-existence-check-' + str(int(os.urandom(4).hex(), 16)),
        'title': 'テスト確認パック',
        'description': 'テーブル存在確認用',
        'file_url': 'test.html',
        'file_size': 1000,
        'is_premium': False,
        'tags': ['test']
    }
    
    result = make_supabase_request('/rest/v1/packs', 'POST', test_pack)
    
    if result['success']:
        # テストデータ削除
        delete_result = make_supabase_request(f'/rest/v1/packs?id=eq.{test_pack["id"]}', 'DELETE')
        return True
    else:
        return False

def insert_lead_magnet_data() -> bool:
    """リードマグネットデータ挿入"""
    print("\n📋 リードマグネットデータ挿入中...")
    
    lead_magnets = [
        {
            'id': 'ai-video-starter-kit-2025',
            'title': '🎬 AI動画作成スターターキット',
            'description': '1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。',
            'file_url': '../lead_magnets/1_ai_video_starter_kit.html',
            'file_size': 147000,
            'is_premium': False,
            'tags': ['AI動画', '台本テンプレート', '7日間計画', '収益化', 'YouTube']
        },
        {
            'id': 'kindle-master-guide-2025',
            'title': '📚 Kindle出版完全攻略ガイド',
            'description': '30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。',
            'file_url': '../lead_magnets/2_kindle_master_guide.html',
            'file_size': 132000,
            'is_premium': False,
            'tags': ['Kindle出版', 'KDP', 'AI活用', '30日計画', '電子書籍']
        },
        {
            'id': 'blog-templates-collection-2025',
            'title': '📝 ブログ収益化テンプレート集',
            'description': '月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。',
            'file_url': '../lead_magnets/3_blog_templates/templates.md',
            'file_size': 89000,
            'is_premium': False,
            'tags': ['ブログ', 'SEO', 'アフィリエイト', 'テンプレート', '収益化']
        },
        {
            'id': 'ai-prompts-sidebusiness-50-2025',
            'title': '🤖 AIプロンプト集（副業特化50選）',
            'description': '動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。',
            'file_url': '../lead_magnets/4_prompts_50/prompts.md',
            'file_size': 76000,
            'is_premium': False,
            'tags': ['AIプロンプト', 'ChatGPT', '副業', '50選', 'テンプレート']
        },
        {
            'id': 'roadmap-90days-30k-2025',
            'title': '🎯 月3万円達成90日ロードマップ',
            'description': '継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。',
            'file_url': '../lead_magnets/5_90day_roadmap/roadmap.md',
            'file_size': 95000,
            'is_premium': False,
            'tags': ['90日計画', '月3万円', 'ロードマップ', '目標管理', '副業']
        },
        {
            'id': 'time-management-sidebusiness-2025',
            'title': '⏰ 副業時間管理術',
            'description': '週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。',
            'file_url': '../lead_magnets/6_time_management/guide.md',
            'file_size': 64000,
            'is_premium': True,
            'tags': ['時間管理', '習慣化', '自動化', '両立術', 'プレミアム']
        }
    ]
    
    success_count = 0
    error_count = 0
    
    for pack in lead_magnets:
        result = make_supabase_request('/rest/v1/packs', 'POST', pack)
        
        if result['success']:
            print(f"✅ {pack['title']} を挿入しました")
            success_count += 1
        elif result['status_code'] == 409:  # Conflict - already exists
            print(f"⏭️  {pack['title']} は既に存在しています")
            success_count += 1
        else:
            print(f"❌ {pack['title']} の挿入に失敗: {result['error']}")
            error_count += 1
    
    print(f"\n📊 挿入結果: 成功 {success_count}件, 失敗 {error_count}件")
    return error_count == 0

def verify_data() -> bool:
    """データ挿入確認"""
    print("\n🔍 データ確認中...")
    
    result = make_supabase_request('/rest/v1/packs?select=id,title,is_premium&order=created_at')
    
    if result['success'] and result['data']:
        packs = result['data']
        print(f"✅ {len(packs)}個のリードマグネットが登録されています:")
        
        for i, pack in enumerate(packs, 1):
            premium_badge = "💎" if pack.get('is_premium') else "🆓"
            print(f"  {i}. {premium_badge} {pack.get('title', 'Unknown')}")
        
        return True
    else:
        print(f"❌ データ確認失敗: {result.get('error', 'Unknown error')}")
        return False

def main():
    """メイン処理"""
    print("🚀 Supabase 最適化セットアップ開始...\n")
    
    # 環境変数確認
    if not all([SUPABASE_URL, SUPABASE_SECRET_KEY]):
        print("❌ 必要な環境変数が設定されていません")
        print(f"SUPABASE_URL: {'✅' if SUPABASE_URL else '❌'}")
        print(f"SECRET_KEY: {'✅' if SUPABASE_SECRET_KEY else '❌'}")
        return False
    
    # 1. テーブル存在確認
    if not check_table_exists():
        print("\n❌ データベーステーブルが存在しません")
        print("\n📋 手動セットアップが必要です:")
        print("1. https://supabase.com/dashboard にアクセス")
        print("2. プロジェクト選択 → SQL Editor")
        print("3. scripts/create-supabase-tables.sql の内容をコピー&実行")
        print("\n💡 SQLファイルには以下が含まれています:")
        print("   - テーブル作成 (packs, claims, downloads)")
        print("   - インデックス設定")
        print("   - RLS (Row Level Security) 設定")
        print("   - 6個のリードマグネットデータ")
        return False
    
    # 2. リードマグネットデータ挿入
    if not insert_lead_magnet_data():
        print("\n❌ データ挿入に失敗しました")
        return False
    
    # 3. データ確認
    if not verify_data():
        print("\n❌ データ確認に失敗しました")
        return False
    
    print("\n🎉 Supabaseデータベースセットアップ完了！")
    print("✅ 次のステップ: Vercelポータルサイトで動作確認")
    return True

if __name__ == "__main__":
    success = main()
    
    if not success:
        print("\n💡 セットアップが完了していない場合の対処法:")
        print("1. 手動SQLファイル実行後、このスクリプトを再実行")
        print("2. または Vercel デプロイ先URLでモックデータ表示確認")
        sys.exit(1)
    else:
        print("\n🌐 Vercel URL: https://ai-salon-portal.vercel.app")
        print("📱 ローカル確認: npm run dev → http://localhost:3001")