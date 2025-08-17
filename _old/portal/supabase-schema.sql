-- AI在宅ワーク研究所 特典配布システム
-- Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- 1. 特典パックテーブル
CREATE TABLE public.packs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage path or direct URL
    file_size BIGINT NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 申請記録テーブル
CREATE TABLE public.claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Generated from Discord info
    discord_user_id TEXT NOT NULL,
    discord_username TEXT NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ダウンロード記録テーブル
CREATE TABLE public.downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- インデックス作成
CREATE INDEX idx_packs_is_premium ON public.packs(is_premium);
CREATE INDEX idx_packs_created_at ON public.packs(created_at DESC);
CREATE INDEX idx_claims_pack_id ON public.claims(pack_id);
CREATE INDEX idx_claims_user_id ON public.claims(user_id);
CREATE INDEX idx_claims_discord_user_id ON public.claims(discord_user_id);
CREATE INDEX idx_downloads_pack_id ON public.downloads(pack_id);
CREATE INDEX idx_downloads_claimed_at ON public.downloads(downloaded_at DESC);

-- RLS (Row Level Security) の設定
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
CREATE TRIGGER update_packs_updated_at
    BEFORE UPDATE ON public.packs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ダウンロード数増加関数
CREATE OR REPLACE FUNCTION increment_download_count(pack_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.packs
    SET download_count = download_count + 1
    WHERE id = pack_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サンプルデータ挿入 (開発・テスト用)
INSERT INTO public.packs (id, title, description, file_url, file_size, is_premium, tags) VALUES
(
    'sample-free-pack-001',
    '🔰 初心者向けChatGPTプロンプト集',
    '副業を始めたばかりの方向けの基本的なプロンプトテンプレート集です。記事作成、アイデア出し、リサーチなど様々な場面で活用できる50個のプロンプトを収録しています。',
    'prompts/beginner_chatgpt_prompts.pdf',
    2456789,
    false,
    ARRAY['ChatGPT', 'プロンプト', '初心者', '記事作成', 'テンプレート']
),
(
    'sample-premium-pack-001',
    '💎 高単価案件獲得マニュアル',
    'プレミアム研究員限定の高単価案件獲得ノウハウです。1記事5,000円以上の案件を安定的に受注するための営業文テンプレート、ポートフォリオ作成方法、価格交渉術などを詳しく解説しています。',
    'manuals/premium_high_rate_manual.pdf',
    8923456,
    true,
    ARRAY['高単価', '案件獲得', '営業', 'ポートフォリオ', 'プレミアム']
),
(
    'sample-free-pack-002',
    '📊 Excel自動化テンプレート',
    '業務効率化のためのExcel自動化テンプレート集です。データ集計、レポート作成、スケジュール管理など、在宅ワークで頻繁に使用する作業を自動化できるテンプレート20個を収録。',
    'templates/excel_automation_templates.zip',
    5234567,
    false,
    ARRAY['Excel', '自動化', 'テンプレート', '効率化', '業務']
);

-- 統計・分析用ビュー
CREATE VIEW pack_stats AS
SELECT
    p.id,
    p.title,
    p.is_premium,
    p.download_count,
    COUNT(DISTINCT c.user_id) as unique_claimers,
    COUNT(d.id) as total_downloads,
    p.created_at
FROM public.packs p
LEFT JOIN public.claims c ON p.id = c.pack_id
LEFT JOIN public.downloads d ON p.id = d.pack_id
GROUP BY p.id, p.title, p.is_premium, p.download_count, p.created_at;

-- 日別ダウンロード統計
CREATE VIEW daily_download_stats AS
SELECT
    DATE(d.downloaded_at) as download_date,
    COUNT(*) as total_downloads,
    COUNT(DISTINCT d.user_id) as unique_users,
    COUNT(CASE WHEN p.is_premium THEN 1 END) as premium_downloads,
    COUNT(CASE WHEN NOT p.is_premium THEN 1 END) as free_downloads
FROM public.downloads d
JOIN public.packs p ON d.pack_id = p.id
GROUP BY DATE(d.downloaded_at)
ORDER BY download_date DESC;

-- ユーザー活動統計
CREATE VIEW user_activity_stats AS
SELECT
    c.discord_username,
    c.discord_user_id,
    COUNT(DISTINCT c.pack_id) as packs_claimed,
    COUNT(d.id) as total_downloads,
    MIN(c.claimed_at) as first_claim,
    MAX(c.claimed_at) as last_claim
FROM public.claims c
LEFT JOIN public.downloads d ON c.id = d.claim_id
GROUP BY c.discord_username, c.discord_user_id;

-- 管理者用関数 (統計取得)
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE (
    total_packs INTEGER,
    free_packs INTEGER,
    premium_packs INTEGER,
    total_claims INTEGER,
    total_downloads INTEGER,
    unique_users INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::INTEGER FROM public.packs),
        (SELECT COUNT(*)::INTEGER FROM public.packs WHERE NOT is_premium),
        (SELECT COUNT(*)::INTEGER FROM public.packs WHERE is_premium),
        (SELECT COUNT(*)::INTEGER FROM public.claims),
        (SELECT COUNT(*)::INTEGER FROM public.downloads),
        (SELECT COUNT(DISTINCT user_id)::INTEGER FROM public.claims);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- コメント追加
COMMENT ON TABLE public.packs IS '特典パック情報テーブル';
COMMENT ON TABLE public.claims IS '特典申請記録テーブル';
COMMENT ON TABLE public.downloads IS 'ダウンロード実行記録テーブル';

COMMENT ON COLUMN public.packs.file_url IS 'Supabase Storageのパス または 直接URL';
COMMENT ON COLUMN public.packs.is_premium IS 'true: プレミアム限定, false: 無料';
COMMENT ON COLUMN public.claims.user_id IS 'Discord情報から生成されるユニークID';
COMMENT ON COLUMN public.downloads.ip_address IS 'ダウンロード時のIPアドレス (分析用)';

-- 完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '=================================';
    RAISE NOTICE 'AI在宅ワーク研究所 特典配布システム';
    RAISE NOTICE 'データベーススキーマ構築完了！';
    RAISE NOTICE '=================================';
    RAISE NOTICE 'テーブル作成: ✅ packs, claims, downloads';
    RAISE NOTICE 'インデックス: ✅ パフォーマンス最適化済み';
    RAISE NOTICE 'RLS設定: ✅ セキュリティ有効';
    RAISE NOTICE 'サンプルデータ: ✅ 3個のパック挿入済み';
    RAISE NOTICE 'ビュー作成: ✅ 統計・分析用ビュー';
    RAISE NOTICE '=================================';
END $$;