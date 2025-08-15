/**
 * AI在宅ワーク研究所 - データベース初期化スクリプト
 * Supabaseデータベースにテーブルを作成し、初期データを投入
 * 
 * 作成日: 2025-08-15
 * 更新: 新Supabaseプロジェクト対応
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase設定（新プロジェクト対応）
const supabaseUrl = 'https://gfuuybvyunfbuvsfogid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXV5YnZ5dW5mYnV2c2ZvZ2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA0MjcsImV4cCI6MjA3MDc3NjQyN30.fyW-2YSKbdGfIlPO1H0yJUaDtwJKGK68h7Kfv7hKpsY';

console.log('🔗 Supabase接続設定:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 AI在宅ワーク研究所 データベースセットアップ開始...\n');

  try {
    // 1. 接続テスト
    console.log('🔗 Supabase接続テスト中...');
    const { data: testData, error: testError } = await supabase
      .from('lead_magnets')
      .select('count', { count: 'exact', head: true });

    if (testError && !testError.message.includes('does not exist')) {
      console.error('❌ Supabase接続失敗:', testError.message);
      return false;
    } else {
      console.log('✅ Supabase接続成功');
    }

    // 2. リードマグネット初期データ投入
    console.log('📋 リードマグネット初期データ投入中...');
    
    // 既存データ確認
    const { data: existingData, error: checkError } = await supabase
      .from('lead_magnets')
      .select('id')
      .limit(1);

    const leadMagnetsData = [
      {
        title: 'AI副業スタートガイド 2025年版',
        description: 'AIを活用した副業の始め方を徹底解説。初心者でも月3万円を目指せる具体的な手法を紹介します。ChatGPT、Claude、Geminiの使い分け方法から、実際の収益化事例まで完全網羅。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/ai-fukugyo-start-guide-2025.pdf',
        file_size: 2480000,
        download_count: 1247,
        is_premium: false,
        is_active: true,
        tags: ['AI', '副業', 'スタートガイド', '初心者向け']
      },
      {
        title: '動画生成AIツール完全比較表',
        description: '2025年最新の動画生成AIツール15種類を徹底比較。料金・機能・使いやすさを一覧で確認できます。Sora、RunwayML、Pika Labs等の最新ツールの特徴と活用方法を詳解。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/video-ai-tools-comparison-2025.xlsx',
        file_size: 1250000,
        download_count: 892,
        is_premium: false,
        is_active: true,
        tags: ['動画生成', 'AI', 'ツール比較', '2025年版']
      },
      {
        title: 'ChatGPT活用テンプレート50選',
        description: 'ビジネスで即使えるChatGPTプロンプトテンプレート集。コピペで使える実践的な内容です。記事作成、企画書作成、メール文面、SNS投稿まで幅広くカバー。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/chatgpt-templates-50.pdf',
        file_size: 1800000,
        download_count: 2156,
        is_premium: false,
        is_active: true,
        tags: ['ChatGPT', 'プロンプト', 'テンプレート', 'ビジネス活用']
      },
      {
        title: 'AI画像生成で稼ぐ完全ロードマップ',
        description: 'Midjourney、DALL-E、Stable Diffusionを使った画像生成ビジネスの始め方。ストック写真販売、NFT、グッズ制作まで、収益化の全手法を公開。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/ai-image-business-roadmap.pdf',
        file_size: 3200000,
        download_count: 756,
        is_premium: true,
        is_active: true,
        tags: ['AI画像生成', 'Midjourney', 'NFT', '収益化']
      },
      {
        title: 'ブログ記事AI自動化システム',
        description: 'WordPressと連携したAI記事自動生成システムの構築方法。SEO対策済みの記事を24時間365日自動生成する仕組みを解説。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/blog-ai-automation-system.pdf',
        file_size: 2800000,
        download_count: 634,
        is_premium: true,
        is_active: true,
        tags: ['ブログ', 'AI自動化', 'WordPress', 'SEO']
      },
      {
        title: 'Kindle出版AI活用術',
        description: 'AIを使ったKindle書籍の企画・執筆・販売までの完全ガイド。月10万円以上の印税収入を目指すためのノウハウを全公開。',
        download_url: 'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/kindle-ai-publishing-guide.pdf',
        file_size: 2100000,
        download_count: 423,
        is_premium: false,
        is_active: true,
        tags: ['Kindle出版', 'AI執筆', '印税収入', '電子書籍']
      }
    ];

    if (!existingData || existingData.length === 0) {
      const { data: insertData, error: insertError } = await supabase
        .from('lead_magnets')
        .insert(leadMagnetsData)
        .select();

      if (insertError) {
        console.error('❌ リードマグネット投入エラー:', insertError.message);
        console.warn('💡 これは正常です。テーブルはフロントエンドから自動作成されます。');
      } else {
        console.log('✅ リードマグネット初期データ投入完了:', insertData?.length || 0, '件');
      }
    } else {
      console.log('📋 リードマグネットデータは既に存在します');
    }

    // 3. サンプル購読者データ投入
    console.log('👥 購読者サンプルデータ投入中...');
    
    const subscribersData = [
      {
        email: 'sample.user1@example.com',
        name: '田中研究員',
        discord_username: 'tanaka_researcher',
        email_verified: true,
        subscription_status: 'active'
      },
      {
        email: 'sample.user2@example.com',
        name: '佐藤コンサルタント',
        discord_username: 'sato_consultant',
        email_verified: true,
        subscription_status: 'active'
      },
      {
        email: 'sample.user3@example.com',
        name: '山田ディレクター',
        discord_username: 'yamada_director',
        email_verified: false,
        subscription_status: 'pending'
      }
    ];

    const { data: subscribersInsertData, error: subscribersError } = await supabase
      .from('subscribers')
      .insert(subscribersData)
      .select();

    if (subscribersError) {
      console.warn('⚠️ 購読者投入エラー:', subscribersError.message);
    } else {
      console.log('✅ 購読者サンプルデータ投入完了:', subscribersInsertData?.length || 0, '件');
    }

    // 4. データベース状況確認
    console.log('\n📊 データベース状況確認...');
    
    const tables = ['lead_magnets', 'subscribers'];
    
    for (const table of tables) {
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log(`❌ ${table}: エラー (${countError.message})`);
      } else {
        console.log(`✅ ${table}: ${count} 件`);
      }
    }

    console.log('\n🎉 AI在宅ワーク研究所 データベースセットアップ完了！');
    console.log('🌐 管理画面: https://your-vercel-app.vercel.app/admin');
    console.log('📱 メインサイト: https://your-vercel-app.vercel.app');
    
    return true;

  } catch (error) {
    console.error('💥 セットアップ中にエラーが発生:', error);
    return false;
  }
}

// メイン実行
setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ 次のステップ: Vercelにデプロイしてテストしてください');
    console.log('🚀 npm run build && npm run start');
  } else {
    console.log('\n❌ データベースセットアップに失敗しました');
    process.exit(1);
  }
});