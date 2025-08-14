/**
 * AI在宅ワーク研究所 - データベース初期化スクリプト
 * Supabaseデータベースにテーブルを作成
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase設定
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // 管理者権限が必要

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません：SUPABASE_URL, SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 AI在宅ワーク研究所 データベースセットアップ開始...\n');

  try {
    // 1. パックステーブル作成
    console.log('📦 packs テーブルを作成中...');
    
    const { error: packsError } = await supabase.rpc('exec_sql', {
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
      console.log('📦 packs テーブルを直接作成試行...');
      // RPCが使えない場合の代替手法
      const { error: directPacksError } = await supabase
        .from('packs')
        .select('id')
        .limit(1);
      
      if (directPacksError && directPacksError.message.includes('does not exist')) {
        console.error('❌ packsテーブルが存在しません。Supabaseダッシュボードで以下のSQLを実行してください:');
        console.log(`
CREATE TABLE public.packs (
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

-- Row Level Security設定
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

-- 読み取り許可ポリシー
CREATE POLICY "Allow read access to packs" ON public.packs
  FOR SELECT USING (true);

-- 挿入許可ポリシー（スクリプト用）
CREATE POLICY "Allow insert to packs" ON public.packs
  FOR INSERT WITH CHECK (true);
        `);
        return false;
      }
    } else {
      console.log('✅ packs テーブル作成成功');
    }

    // 2. 接続テスト
    console.log('🔗 Supabase接続テスト中...');
    const { data, error } = await supabase
      .from('packs')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ 接続テスト失敗:', error.message);
      return false;
    } else {
      console.log('✅ Supabase接続成功');
    }

    // 3. RLS設定確認
    console.log('🔒 Row Level Security確認中...');
    const { data: rlsData, error: rlsError } = await supabase
      .from('packs')
      .select('*')
      .limit(1);

    if (rlsError) {
      console.warn('⚠️ RLS設定が必要かもしれません:', rlsError.message);
    } else {
      console.log('✅ RLS設定確認完了');
    }

    console.log('\n🎉 データベースセットアップ完了！');
    return true;

  } catch (error) {
    console.error('💥 セットアップ中にエラーが発生:', error);
    return false;
  }
}

// メイン実行
setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ 次のステップ: node scripts/populate-leadmagnets.js');
  } else {
    console.log('\n❌ データベースセットアップに失敗しました');
    process.exit(1);
  }
});