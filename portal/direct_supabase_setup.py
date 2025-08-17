#!/usr/bin/env python3
"""
Supabase データベース直接セットアップ
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
SUPABASE_ANON_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUPABASE_SECRET_KEY = os.environ.get('SUPABASE_SECRET_KEY')

if not all([SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SECRET_KEY]):
    print("❌ 環境変数が設定されていません")
    print(f"SUPABASE_URL: {SUPABASE_URL}")
    print(f"ANON_KEY: {'✅' if SUPABASE_ANON_KEY else '❌'}")
    print(f"SECRET_KEY: {'✅' if SUPABASE_SECRET_KEY else '❌'}")
    sys.exit(1)

def execute_sql(sql_query):
    """Supabase REST API経由でSQL実行"""
    try:
        # PostgREST経由でのSQL実行を試行
        url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
        data = json.dumps({'query': sql_query}).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {SUPABASE_SECRET_KEY}',
                'apikey': SUPABASE_SECRET_KEY
            }
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return {'success': True, 'data': result}
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {'success': False, 'error': f'HTTP {e.code}: {error_body}'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def insert_pack(pack_data):
    """特典パックデータを挿入"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/packs"
        data = json.dumps(pack_data).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {SUPABASE_SECRET_KEY}',
                'apikey': SUPABASE_SECRET_KEY,
                'Prefer': 'return=minimal'
            }
        )
        
        with urllib.request.urlopen(req) as response:
            return {'success': True, 'status': response.status}
            
    except urllib.error.HTTPError as e:
        if e.code == 409:  # Conflict - already exists
            return {'success': True, 'status': 409, 'message': '既存'}
        elif e.code == 404:  # Table not found
            return {'success': False, 'error': 'テーブルが存在しません', 'need_schema': True}
        else:
            error_body = e.read().decode()
            return {'success': False, 'error': f'HTTP {e.code}: {error_body}'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def check_table_exists():
    """テーブル存在確認"""
    test_pack = {
        'id': 'test-existence-check',
        'title': 'テスト',
        'description': 'テスト',
        'file_url': 'test.pdf',
        'file_size': 1000,
        'is_premium': False,
        'tags': ['test']
    }
    
    result = insert_pack(test_pack)
    
    if result.get('need_schema'):
        return False
    elif result['success']:
        # テスト データを削除
        try:
            url = f"{SUPABASE_URL}/rest/v1/packs?id=eq.test-existence-check"
            req = urllib.request.Request(
                url,
                headers={
                    'Authorization': f'Bearer {SUPABASE_SECRET_KEY}',
                    'apikey': SUPABASE_SECRET_KEY
                }
            )
            req.get_method = lambda: 'DELETE'
            urllib.request.urlopen(req)
        except:
            pass  # 削除失敗は無視
        return True
    else:
        return False

def setup_database():
    """データベース全体セットアップ"""
    print("🚀 Supabase データベースセットアップ開始...\n")
    
    # 1. テーブル存在確認
    print("📦 テーブル存在確認中...")
    if check_table_exists():
        print("✅ packsテーブルが既に存在しています")
    else:
        print("❌ packsテーブルが存在しません")
        print("\n📋 手動でテーブル作成が必要です:")
        print("1. https://supabase.com/dashboard にアクセス")
        print("2. プロジェクト選択 → SQL Editor")
        print("3. create-tables-sql.sql の内容をコピー&実行")
        
        # SQLファイル内容表示
        if os.path.exists('create-tables-sql.sql'):
            print("\n📄 実行するSQL:")
            print("=" * 50)
            with open('create-tables-sql.sql', 'r') as f:
                print(f.read())
            print("=" * 50)
        
        return False
    
    # 2. リードマグネットデータ挿入
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
        result = insert_pack(pack)
        
        if result['success']:
            if result.get('status') == 409:
                print(f"⏭️  {pack['title']} は既に存在しています")
            else:
                print(f"✅ {pack['title']} を挿入しました")
            success_count += 1
        else:
            print(f"❌ {pack['title']} の挿入に失敗: {result['error']}")
            error_count += 1
    
    print(f"\n📊 挿入結果: 成功 {success_count}件, 失敗 {error_count}件")
    
    if error_count == 0:
        print("\n🎉 データベースセットアップ完了！")
        return True
    else:
        print(f"\n⚠️ {error_count}件の失敗がありました")
        return False

if __name__ == "__main__":
    success = setup_database()
    
    if success:
        print("\n✅ 次のステップ: Vercelポータルサイトで動作確認")
        print("🌐 Vercel URL で特典パックが表示されることを確認してください")
    else:
        print("\n❌ データベースセットアップに問題があります")
        sys.exit(1)