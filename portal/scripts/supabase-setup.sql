-- AI在宅ワーク研究所 ポータルサイト データベース設定
-- 作成日: 2025-08-15
-- プロジェクト: ai-salon (gfuuybvyunfbuvsfogid)

-- ==============================================
-- 1. リードマグネット（無料特典）管理テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS lead_magnets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    download_url TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. 購読者・メンバー管理テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    discord_user_id VARCHAR(50),
    discord_username VARCHAR(100),
    email_verified BOOLEAN DEFAULT false,
    subscription_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. ダウンロード履歴テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
    lead_magnet_id UUID REFERENCES lead_magnets(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. メールキャンペーン管理テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    sender_email VARCHAR(255) DEFAULT 'info@ai-salon.jp',
    sender_name VARCHAR(100) DEFAULT 'AI在宅ワーク研究所',
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. 個別送信履歴・開封率追跡テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS campaign_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'sent'
);

-- ==============================================
-- インデックス作成
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_discord ON subscribers(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_subscriber ON downloads(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_downloads_lead_magnet ON downloads(lead_magnet_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_subscriber ON campaign_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_active ON lead_magnets(is_active);

-- ==============================================
-- Row Level Security (RLS) 設定
-- ==============================================
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sends ENABLE ROW LEVEL SECURITY;

-- 公開リードマグネット読み取りポリシー
CREATE POLICY "Allow public read for active lead magnets" ON lead_magnets
    FOR SELECT TO anon USING (is_active = true);

-- 認証ユーザーによる購読者作成ポリシー
CREATE POLICY "Allow authenticated users to create subscribers" ON subscribers
    FOR INSERT TO anon WITH CHECK (true);

-- 認証ユーザーによるダウンロード記録ポリシー
CREATE POLICY "Allow authenticated users to create downloads" ON downloads
    FOR INSERT TO anon WITH CHECK (true);

-- ==============================================
-- 初期データ投入
-- ==============================================

-- リードマグネット初期データ
INSERT INTO lead_magnets (title, description, download_url, file_size, is_active, tags) VALUES
(
    'AI副業スタートガイド 2025年版',
    'AIを活用した副業の始め方を徹底解説。初心者でも月3万円を目指せる具体的な手法を紹介します。',
    'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/ai-fukugyo-start-guide-2025.pdf',
    2480000,
    true,
    '{"AI", "副業", "スタートガイド", "初心者向け"}'
),
(
    '動画生成AIツール完全比較表',
    '2025年最新の動画生成AIツール15種類を徹底比較。料金・機能・使いやすさを一覧で確認できます。',
    'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/video-ai-tools-comparison-2025.xlsx',
    1250000,
    true,
    '{"動画生成", "AI", "ツール比較", "2025年版"}'
),
(
    'ChatGPT活用テンプレート50選',
    'ビジネスで即使えるChatGPTプロンプトテンプレート集。コピペで使える実践的な内容です。',
    'https://gfuuybvyunfbuvsfogid.supabase.co/storage/v1/object/public/lead-magnets/chatgpt-templates-50.pdf',
    1800000,
    true,
    '{"ChatGPT", "プロンプト", "テンプレート", "ビジネス活用"}'
)
ON CONFLICT DO NOTHING;

-- メールキャンペーン初期データ
INSERT INTO email_campaigns (name, subject, content, status) VALUES
(
    'ウェルカムメール',
    '🎉 AI在宅ワーク研究所へようこそ！あなたの副業成功への第一歩',
    'AI在宅ワーク研究所へのご参加、誠にありがとうございます！

私たちは、AIを活用して月3万円の副収入を目指すコミュニティです。

【今すぐできること】
✅ Discordコミュニティに参加
✅ 無料特典をダウンロード
✅ 最新AI情報をチェック

一緒に副業成功を目指しましょう！

AI在宅ワーク研究所チーム',
    'active'
),
(
    '週次AI情報',
    '📺 今週のAIニュース：新しい稼ぎ方が見つかりました',
    '今週のAI業界動向をお届けします。

【注目トピック】
🔥 新しい動画生成AI「Sora」の商用利用開始
💰 AIライティングで月10万円達成者続出
🎯 初心者向けAIツール活用セミナー開催

詳細はコミュニティでチェック！',
    'draft'
)
ON CONFLICT DO NOTHING;

-- ==============================================
-- 便利関数の作成
-- ==============================================

-- ダウンロード数増加関数
CREATE OR REPLACE FUNCTION increment_download_count(magnet_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE lead_magnets 
    SET download_count = download_count + 1, updated_at = NOW()
    WHERE id = magnet_id;
END;
$$ LANGUAGE plpgsql;

-- 開封率計算関数
CREATE OR REPLACE FUNCTION calculate_open_rate(campaign_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_sent INTEGER;
    total_opened INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_sent 
    FROM campaign_sends 
    WHERE campaign_id = campaign_uuid;
    
    SELECT COUNT(*) INTO total_opened 
    FROM campaign_sends 
    WHERE campaign_id = campaign_uuid AND opened_at IS NOT NULL;
    
    IF total_sent = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((total_opened::DECIMAL / total_sent::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 更新日時自動更新トリガー
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガー設定
CREATE TRIGGER update_lead_magnets_updated_at BEFORE UPDATE ON lead_magnets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 設定完了メッセージ
-- ==============================================
-- このSQLスクリプトの実行が完了しました
-- 次のステップ：
-- 1. Supabase Storage bucketの作成
-- 2. 実際のファイルアップロード
-- 3. フロントエンドでのテスト