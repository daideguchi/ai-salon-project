-- AI在宅ワーク研究所 ポータルサイト - テーブル作成
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