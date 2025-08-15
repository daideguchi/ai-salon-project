/**
 * Supabase API経由でデータベーステーブルを直接作成
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません');
  process.exit(1);
}

// SQL実行関数
function executeSQL(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: query
    });

    const options = {
      hostname: new URL(supabaseUrl).hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: JSON.parse(data) });
        } else {
          reject({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

// テーブル直接作成
function createTableDirect() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      id: 'test-pack-2025',
      title: 'テストパック',
      description: 'テスト用パック',
      file_url: 'test.pdf',
      file_size: 1000,
      is_premium: false,
      tags: ['test']
    });

    const options = {
      hostname: new URL(supabaseUrl).hostname,
      path: '/rest/v1/packs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        
        if (res.statusCode === 201) {
          resolve({ success: true, message: 'テーブル存在確認・データ挿入成功' });
        } else if (res.statusCode === 404) {
          reject({ success: false, error: 'テーブルが存在しません', needsManualSetup: true });
        } else {
          reject({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function setupDatabase() {
  console.log('🚀 Supabase API経由セットアップ開始...\n');

  try {
    // 1. テーブル存在確認（データ挿入試行）
    console.log('📦 packsテーブル存在確認中...');
    
    const result = await createTableDirect();
    console.log('✅', result.message);

    // 2. テスト挿入成功 → 実データ挿入
    console.log('\n📋 リードマグネットデータ挿入中...');
    
    const leadMagnets = [
      {
        id: 'ai-video-starter-kit-2025',
        title: '🎬 AI動画作成スターターキット',
        description: '1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。',
        file_url: '../lead_magnets/1_ai_video_starter_kit.html',
        file_size: 147000,
        is_premium: false,
        tags: ['AI動画', '台本テンプレート', '7日間計画', '収益化', 'YouTube']
      },
      {
        id: 'kindle-master-guide-2025',
        title: '📚 Kindle出版完全攻略ガイド',
        description: '30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。',
        file_url: '../lead_magnets/2_kindle_master_guide.html',
        file_size: 132000,
        is_premium: false,
        tags: ['Kindle出版', 'KDP', 'AI活用', '30日計画', '電子書籍']
      },
      {
        id: 'blog-templates-collection-2025',
        title: '📝 ブログ収益化テンプレート集',
        description: '月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。',
        file_url: '../lead_magnets/3_blog_templates/templates.md',
        file_size: 89000,
        is_premium: false,
        tags: ['ブログ', 'SEO', 'アフィリエイト', 'テンプレート', '収益化']
      },
      {
        id: 'ai-prompts-sidebusiness-50-2025',
        title: '🤖 AIプロンプト集（副業特化50選）',
        description: '動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。',
        file_url: '../lead_magnets/4_prompts_50/prompts.md',
        file_size: 76000,
        is_premium: false,
        tags: ['AIプロンプト', 'ChatGPT', '副業', '50選', 'テンプレート']
      },
      {
        id: 'roadmap-90days-30k-2025',
        title: '🎯 月3万円達成90日ロードマップ',
        description: '継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。',
        file_url: '../lead_magnets/5_90day_roadmap/roadmap.md',
        file_size: 95000,
        is_premium: false,
        tags: ['90日計画', '月3万円', 'ロードマップ', '目標管理', '副業']
      },
      {
        id: 'time-management-sidebusiness-2025',
        title: '⏰ 副業時間管理術',
        description: '週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。',
        file_url: '../lead_magnets/6_time_management/guide.md',
        file_size: 64000,
        is_premium: true,
        tags: ['時間管理', '習慣化', '自動化', '両立術', 'プレミアム']
      }
    ];

    // 並行処理で高速化
    const insertPromises = leadMagnets.map(async (pack) => {
      try {
        const postData = JSON.stringify(pack);
        
        return new Promise((resolve, reject) => {
          const options = {
            hostname: new URL(supabaseUrl).hostname,
            path: '/rest/v1/packs',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
              'Prefer': 'return=minimal',
              'Content-Length': Buffer.byteLength(postData)
            }
          };

          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            
            res.on('end', () => {
              if (res.statusCode === 201) {
                console.log(`✅ ${pack.title} を挿入しました`);
                resolve({ success: true, pack: pack.title });
              } else if (res.statusCode === 409) {
                console.log(`⏭️  ${pack.title} は既に存在しています`);
                resolve({ success: true, pack: pack.title, skipped: true });
              } else {
                console.log(`⚠️ ${pack.title} の挿入に失敗: ${res.statusCode}`);
                resolve({ success: false, pack: pack.title, error: data });
              }
            });
          });

          req.on('error', (error) => {
            resolve({ success: false, pack: pack.title, error: error.message });
          });

          req.write(postData);
          req.end();
        });
      } catch (error) {
        return { success: false, pack: pack.title, error: error.message };
      }
    });

    const results = await Promise.all(insertPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n📊 挿入結果: 成功 ${successful}件, 失敗 ${failed}件`);
    
    if (failed > 0) {
      console.log('\n⚠️ 失敗した項目:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.pack}: ${r.error}`);
      });
    }

    console.log('\n🎉 データベースセットアップ完了！');
    return true;

  } catch (error) {
    if (error.needsManualSetup) {
      console.error('\n❌ packsテーブルが存在しません');
      console.log('\n📋 手動セットアップが必要です:');
      console.log('1. https://supabase.com/dashboard にアクセス');
      console.log('2. プロジェクト選択 → SQL Editor');
      console.log('3. scripts/create-supabase-tables.sql の内容をコピー&実行');
      return false;
    } else {
      console.error('\n💥 セットアップエラー:', error);
      return false;
    }
  }
}

// メイン実行
setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ 次のステップ: Vercelポータルサイトで動作確認');
    console.log('🌐 URL: https://your-vercel-app.vercel.app');
  } else {
    console.log('\n❌ データベースセットアップに失敗しました');
    process.exit(1);
  }
});