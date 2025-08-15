/**
 * Supabaseデータベースを直接セットアップするスクリプト
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // 管理者権限キー

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません：NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Supabaseデータベース直接セットアップ開始...\n');

  try {
    // 1. 特典パックテーブル作成
    console.log('📦 packs テーブル作成中...');
    
    const { error: packsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.packs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            file_url TEXT NOT NULL,
            file_size BIGINT NOT NULL DEFAULT 0,
            download_count INTEGER NOT NULL DEFAULT 0,
            is_premium BOOLEAN NOT NULL DEFAULT false,
            tags TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

    if (packsError) {
      console.log('⚠️ RPC経由でのテーブル作成に失敗、代替手法を試行...');
      
      // 代替手法: 直接テーブル挿入を試して存在確認
      const { data: existingPacks, error: checkError } = await supabase
        .from('packs')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.error('❌ packsテーブルが存在しません。');
        console.log('📋 以下の手順でSupabaseダッシュボードで手動作成してください:');
        console.log('1. https://supabase.com/dashboard にアクセス');
        console.log('2. プロジェクト選択 → SQL Editor');
        console.log('3. scripts/create-supabase-tables.sql の内容をコピー&実行');
        return false;
      } else {
        console.log('✅ packs テーブルは既に存在しています');
      }
    } else {
      console.log('✅ packs テーブル作成成功');
    }

    // 2. リードマグネットデータ挿入
    console.log('📋 リードマグネットデータ挿入中...');

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

    // データ挿入（重複チェック付き）
    for (const leadMagnet of leadMagnets) {
      const { data: existing, error: checkError } = await supabase
        .from('packs')
        .select('id')
        .eq('id', leadMagnet.id);

      if (checkError) {
        console.error(`❌ ${leadMagnet.title} の確認に失敗:`, checkError.message);
        continue;
      }

      if (existing && existing.length > 0) {
        console.log(`⏭️  ${leadMagnet.title} は既に存在しています`);
        continue;
      }

      const { error: insertError } = await supabase
        .from('packs')
        .insert(leadMagnet);

      if (insertError) {
        console.error(`❌ ${leadMagnet.title} の挿入に失敗:`, insertError.message);
      } else {
        console.log(`✅ ${leadMagnet.title} を挿入しました`);
      }
    }

    // 3. 最終確認
    console.log('\n🔍 最終確認中...');
    const { data: allPacks, error: finalError } = await supabase
      .from('packs')
      .select('id, title, is_premium')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('❌ 最終確認に失敗:', finalError.message);
      return false;
    }

    console.log('\n📊 挿入されたリードマグネット:');
    allPacks.forEach((pack, index) => {
      const premiumBadge = pack.is_premium ? '💎' : '🆓';
      console.log(`${index + 1}. ${premiumBadge} ${pack.title}`);
    });

    console.log(`\n🎉 データベースセットアップ完了！ (${allPacks.length}個のリードマグネット)`);
    return true;

  } catch (error) {
    console.error('💥 セットアップ中にエラーが発生:', error);
    return false;
  }
}

// メイン実行
createTables().then(success => {
  if (success) {
    console.log('\n✅ 次のステップ: Vercelでポータルサイトを確認してください');
  } else {
    console.log('\n❌ データベースセットアップに失敗しました');
    console.log('📋 手動セットアップ手順:');
    console.log('1. https://supabase.com/dashboard にアクセス');
    console.log('2. プロジェクト選択 → SQL Editor');
    console.log('3. scripts/create-supabase-tables.sql の内容をコピー&実行');
    process.exit(1);
  }
});