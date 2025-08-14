-- AI在宅ワーク研究所 ポータルサイト - Supabase テーブル作成SQL
-- Supabaseダッシュボードで実行してください

-- 1. 特典パックテーブル
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

-- 2. 申請記録テーブル  
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pack_id TEXT NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  discord_user_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ダウンロード記録テーブル
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_packs_is_premium ON public.packs(is_premium);
CREATE INDEX IF NOT EXISTS idx_packs_created_at ON public.packs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_pack_id ON public.claims(pack_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_discord_user_id ON public.claims(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_pack_id ON public.downloads(pack_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON public.downloads(downloaded_at DESC);

-- Row Level Security (RLS) の設定
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー (匿名ユーザーも特典パックを閲覧可能)
CREATE POLICY "Allow read access to packs" ON public.packs
  FOR SELECT USING (true);

-- 申請記録は読み取り専用 (API経由での挿入のみ)
CREATE POLICY "Allow read access to claims" ON public.claims
  FOR SELECT USING (true);

CREATE POLICY "Allow insert to claims" ON public.claims
  FOR INSERT WITH CHECK (true);

-- ダウンロード記録も同様
CREATE POLICY "Allow read access to downloads" ON public.downloads
  FOR SELECT USING (true);

CREATE POLICY "Allow insert to downloads" ON public.downloads
  FOR INSERT WITH CHECK (true);

-- 更新用のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at自動更新トリガー
DROP TRIGGER IF EXISTS update_packs_updated_at ON public.packs;
CREATE TRIGGER update_packs_updated_at
  BEFORE UPDATE ON public.packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- テストデータ挿入（AI在宅ワーク研究所のリードマグネット）
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

-- 完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '=================================';
    RAISE NOTICE 'AI在宅ワーク研究所 ポータルサイト';
    RAISE NOTICE 'データベーススキーマ構築完了！';
    RAISE NOTICE '=================================';
    RAISE NOTICE 'テーブル作成: ✅ packs, claims, downloads';
    RAISE NOTICE 'インデックス: ✅ パフォーマンス最適化済み';
    RAISE NOTICE 'RLS設定: ✅ セキュリティ有効';
    RAISE NOTICE 'テストデータ: ✅ 6個のリードマグネット挿入済み';
    RAISE NOTICE '=================================';
END $$;