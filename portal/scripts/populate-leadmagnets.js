/**
 * AI在宅ワーク研究所 - リードマグネット一括登録スクリプト
 * 作成したリードマグネットをSupabaseデータベースに登録
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase設定
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません：SUPABASE_URL, SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ファイルサイズを取得する関数
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.warn(`⚠️ ファイルサイズ取得失敗: ${filePath}`);
    return 0;
  }
}

// リードマグネット定義
const leadMagnets = [
  {
    id: 'ai-video-starter-kit-2025',
    title: '🎬 AI動画作成スターターキット',
    description: '1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。',
    file_url: '../lead_magnets/1_ai_video_starter_kit.html',
    is_premium: false,
    tags: ['AI動画', '台本テンプレート', '7日間計画', '収益化', 'YouTube'],
    file_path: '../lead_magnets/1_ai_video_starter_kit.html'
  },
  {
    id: 'kindle-master-guide-2025',
    title: '📚 Kindle出版完全攻略ガイド',
    description: '30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。',
    file_url: '../lead_magnets/2_kindle_master_guide.html',
    is_premium: false,
    tags: ['Kindle出版', 'KDP', 'AI活用', '30日計画', '電子書籍'],
    file_path: '../lead_magnets/2_kindle_master_guide.html'
  },
  {
    id: 'blog-templates-collection-2025',
    title: '📝 ブログ収益化テンプレート集',
    description: '月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。',
    file_url: '../lead_magnets/3_blog_templates/templates.md',
    is_premium: false,
    tags: ['ブログ', 'SEO', 'アフィリエイト', 'テンプレート', '収益化'],
    file_path: '../lead_magnets/3_blog_templates/templates.md'
  },
  {
    id: 'ai-prompts-sidebusiness-50-2025',
    title: '🤖 AIプロンプト集（副業特化50選）',
    description: '動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。',
    file_url: '../lead_magnets/4_prompts_50/prompts.md',
    is_premium: false,
    tags: ['AIプロンプト', 'ChatGPT', '副業', '50選', 'テンプレート'],
    file_path: '../lead_magnets/4_prompts_50/prompts.md'
  },
  {
    id: 'roadmap-90days-30k-2025',
    title: '🎯 月3万円達成90日ロードマップ',
    description: '継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。',
    file_url: '../lead_magnets/5_90day_roadmap/roadmap.md',
    is_premium: false,
    tags: ['90日計画', '月3万円', 'ロードマップ', '目標管理', '副業'],
    file_path: '../lead_magnets/5_90day_roadmap/roadmap.md'
  },
  {
    id: 'time-management-sidebusiness-2025',
    title: '⏰ 副業時間管理術',
    description: '週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。',
    file_url: '../lead_magnets/6_time_management/guide.md',
    is_premium: true,
    tags: ['時間管理', '習慣化', '自動化', '両立術', 'プレミアム'],
    file_path: '../lead_magnets/6_time_management/guide.md'
  }
];

async function populateLeadMagnets() {
  console.log('🚀 AI在宅ワーク研究所 リードマグネット登録開始...\n');

  try {
    // 既存のパックをクリア（テスト用）
    console.log('🗑️ 既存のテストデータをクリーンアップ中...');
    const { error: deleteError } = await supabase
      .from('packs')
      .delete()
      .ilike('id', '%-2025');
    
    if (deleteError) {
      console.warn('⚠️ クリーンアップエラー:', deleteError.message);
    }

    // リードマグネットを一つずつ登録
    let successCount = 0;
    for (const magnet of leadMagnets) {
      console.log(`📦 処理中: ${magnet.title}`);
      
      // ファイルサイズを取得
      const leadMagnetsPath = path.join(__dirname, '../../lead_magnets');
      const relativeFilePath = magnet.file_path.replace('../lead_magnets/', '');
      const fullFilePath = path.join(leadMagnetsPath, relativeFilePath);
      const fileSize = getFileSize(fullFilePath);
      
      // データベースに挿入
      const { error } = await supabase
        .from('packs')
        .insert({
          id: magnet.id,
          title: magnet.title,
          description: magnet.description,
          file_url: magnet.file_url,
          file_size: fileSize,
          is_premium: magnet.is_premium,
          tags: magnet.tags,
          download_count: 0
        });

      if (error) {
        console.error(`❌ 登録失敗: ${magnet.title}`, error.message);
      } else {
        console.log(`✅ 登録成功: ${magnet.title} (${Math.round(fileSize/1024)}KB)`);
        successCount++;
      }
    }

    console.log(`\n🎉 リードマグネット登録完了！`);
    console.log(`📊 成功: ${successCount}個 / 全体: ${leadMagnets.length}個`);

    // 統計情報を表示
    const { data: stats, error: statsError } = await supabase
      .from('packs')
      .select('is_premium')
      .ilike('id', '%-2025');

    if (!statsError && stats) {
      const freeCount = stats.filter(p => !p.is_premium).length;
      const premiumCount = stats.filter(p => p.is_premium).length;
      console.log(`📈 無料特典: ${freeCount}個, プレミアム特典: ${premiumCount}個`);
    }

  } catch (error) {
    console.error('💥 登録処理中にエラーが発生:', error);
    process.exit(1);
  }
}

// メイン実行
populateLeadMagnets();