# 🎯 AI副業サロン LINE公式アカウント 完全セットアップガイド

**最終更新**: 2025-08-17  
**対象**: LINE公式アカウント + リードマグネット配布システム  
**所要時間**: 約30分  
**技術レベル**: 初級〜中級

---

## 📋 完了状況サマリー

### ✅ 技術実装完了済み
- **LINE Bot API Webhook**: 完全実装済み
- **リッチメニューシステム**: 自動設定スクリプト完成
- **自動応答システム**: キーワード対応・フォロー時メッセージ実装
- **テスト・検証スクリプト**: 自動化ツール完成
- **デプロイメント**: Vercel・Railway 両方対応

### 🚧 手動設定が必要
- **LINE Developers Console設定**: Channel作成・Webhook URL設定
- **環境変数設定**: LINE APIキー設定
- **デプロイ最終調整**: Railway手動設定またはVercel SSO解決

---

## 🚀 クイックスタート（最短手順）

### STEP 1: デプロイメント選択

**推奨**: **Vercel** （SSO問題があるが、アプリケーションは動作中）

```bash
# 現在利用可能なWebhook URL
https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook
```

### STEP 2: LINE Developers Console設定

1. **LINE for Business**: https://www.linebiz.com/jp/login にログイン
2. **Messaging API チャンネル作成**:
   ```
   チャンネル名: AI在宅ワーク研究所Bot
   チャンネル説明: AI副業サロンの自動応答Bot
   ```
3. **基本設定**:
   - Channel Access Token取得
   - Channel Secret取得
   - Webhook URL設定: `https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook`
   - Use webhook: ON

### STEP 3: 環境変数設定

`portal/.env.local` ファイル作成:
```env
# LINE公式アカウント設定
LINE_CHANNEL_ACCESS_TOKEN=your_actual_channel_access_token_here
LINE_CHANNEL_SECRET=your_actual_channel_secret_here

# Supabase設定（設定済み）
NEXT_PUBLIC_SUPABASE_URL=https://gfuuybvyunfbuvsfogid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXV5YnZ5dW5mYnV2c2ZvZ2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA0MjcsImV4cCI6MjA3MDc3NjQyN30.fyW-2YSKbdGfIlPO1H0yJUaDtwJKGK68h7Kfv7hKpsY

# その他設定
JWT_SECRET=ai-salon-portal-jwt-secret-2025
NEXT_PUBLIC_SITE_URL=https://portal-ir60ihqni-daideguchis-projects.vercel.app
NEXT_PUBLIC_SITE_NAME=AI在宅ワーク研究所
```

### STEP 4: 自動設定実行

```bash
cd portal

# 1. 設定自動化実行
node scripts/setup-line-automation.js

# 2. リッチメニュー作成
node scripts/line-richmenu-setup.js create

# 3. 動作確認テスト
node scripts/test-line-webhook.js
```

### STEP 5: 動作確認・運用開始

1. **LINE公式アカウントにフォロー**
2. **テストメッセージ送信**: 「ガイド」「Discord」「料金」等
3. **自動応答確認**
4. **リッチメニュー動作確認**

---

## 🔧 詳細設定手順

### 📱 LINE Developers Console 詳細設定

#### アカウント作成・ログイン
1. https://developers.line.biz/console/ アクセス
2. LINE Business ID でログイン
3. プロバイダー作成（初回のみ）

#### Messaging API チャンネル作成
```
チャンネル名: AI在宅ワーク研究所Bot
チャンネル説明: AI副業・在宅ワーク支援の自動応答Bot
大業種: インターネット・通信
小業種: インターネットサービス
```

#### 基本設定タブ
- **チャンネルアクセストークン**: 「発行」をクリック → コピー
- **チャネルシークレット**: 表示 → コピー
- **プライバシーポリシーURL**: https://your-domain.com/privacy （オプション）
- **サービス利用規約URL**: https://your-domain.com/terms （オプション）

#### Messaging API設定タブ
- **Webhook URL**: `https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook`
- **Use webhook**: ON
- **Webhook redelivery**: ON （推奨）
- **応答メッセージ**: OFF （Botで制御するため）
- **あいさつメッセージ**: OFF （Botで制御するため）

### 🎨 リッチメニュー設定詳細

自動作成されるリッチメニュー構成:
```
┌──────────────┬──────────────┬──────────────┐
│  📚 無料ガイド  │  💬 Discord  │  🎯 使い方   │
│   受け取り     │  コミュニティ  │   ガイド     │
├──────────────┼──────────────┼──────────────┤
│  📞 質問・相談  │  💰 料金案内  │  🚀 今すぐ   │
│               │              │   始める     │
└──────────────┴──────────────┴──────────────┘
```

手動でカスタマイズする場合:
1. **LINE Official Account Manager** にログイン
2. **リッチメニュー** > **作成**
3. **画像**: `portal/scripts/` の生成されたSVGを使用
4. **リンク設定**: 各エリアに対応するURLを設定

### 🤖 自動応答設定確認

実装済みキーワード応答:
- **「ガイド」** → リードマグネット案内
- **「Discord」** → コミュニティ参加案内
- **「料金」** → 料金・プラン説明
- **「始め方」** → スタートガイド
- **「質問」** → サポート案内
- **フォロー時** → ウェルカムメッセージ

### 🔍 テスト・動作確認手順

#### 基本動作テスト
```bash
# Webhook エンドポイント確認
curl -X GET https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook

# 自動テスト実行
node scripts/test-line-webhook.js

# 設定確認
node scripts/setup-line-automation.js
```

#### LINE公式アカウントテスト
1. **QRコードまたは LINE ID でフォロー**
2. **フォロー時メッセージ確認**
3. **キーワード送信テスト**:
   - 「ガイド」→ リードマグネット案内
   - 「Discord」→ コミュニティ案内
   - 「料金」→ 料金案内
4. **リッチメニュータップテスト**

---

## 🚨 トラブルシューティング

### よくある問題と解決法

#### 1. Webhook URLが応答しない
```bash
# 問題確認
curl -X GET https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook

# Vercel SSO認証問題の場合
→ LINE Developers Console で一時的に他のURLを使用
→ または Railway デプロイ完了を待つ
```

#### 2. 環境変数エラー
```bash
# .env.local ファイル確認
cat .env.local

# 必須変数確認
node scripts/setup-line-automation.js
```

#### 3. リッチメニューが表示されない
```bash
# リッチメニュー再作成
node scripts/line-richmenu-setup.js create

# LINE公式アカウントでメニュー設定確認
→ LINE Official Account Manager > リッチメニュー
```

#### 4. 自動応答が動作しない
```bash
# Webhook URL設定確認
→ LINE Developers Console > Messaging API設定

# Webhook送信テスト
→ LINE Developers Console > Messaging API設定 > 検証
```

### エラーコードと対処法

| エラーコード | 意味 | 対処法 |
|-------------|------|--------|
| 401 | 認証エラー | Channel Access Token確認 |
| 403 | 権限エラー | Channel Secret確認 |
| 404 | URLエラー | Webhook URL確認 |
| 500 | サーバーエラー | デプロイ状況確認 |

---

## 📊 運用・分析設定

### LINE公式アカウント分析設定

**LINE Official Account Manager** で確認できる指標:
- **友だち数**: 登録者数の推移
- **メッセージ送信数**: 配信実績
- **インプレッション**: リッチメニュータップ数
- **クリック数**: リンククリック数

### リードマグネット配布分析

**Supabase Dashboard** で確認できる指標:
- **ダウンロード数**: リードマグネット別実績
- **参照元分析**: LINE・Discord別流入
- **コンバージョン率**: フォロー→ダウンロード率

### 推奨KPI

#### 基本指標（月次）
- **友だち登録数**: 目標 1,000人（3ヶ月）
- **メッセージ開封率**: 目標 85%以上
- **リンククリック率**: 目標 15%以上
- **リードマグネットDL数**: 目標 500件/月

#### 収益指標（3-6ヶ月）
- **Discord誘導率**: 目標 25%以上
- **有料会員転換率**: 目標 5%
- **月間収益向上**: 目標 30万円

---

## 🎯 今後の拡張計画

### 短期拡張（1-2週間）
- [ ] セグメント配信（初心者 vs 経験者）
- [ ] プッシュメッセージ送信機能
- [ ] ユーザータグ管理
- [ ] A/Bテスト機能

### 中期拡張（1-2ヶ月）
- [ ] AI ChatGPT連携による動的応答
- [ ] Supabaseユーザーデータ連携
- [ ] 詳細分析ダッシュボード
- [ ] 自動フォローアップ機能

### 長期拡張（3-6ヶ月）
- [ ] 多言語対応
- [ ] 音声メッセージ対応
- [ ] 画像認識・応答
- [ ] EC機能統合

---

## 📞 サポート・リソース

### 公式ドキュメント
- **LINE Developers**: https://developers.line.biz/ja/docs/
- **Messaging API**: https://developers.line.biz/ja/docs/messaging-api/
- **リッチメニュー**: https://developers.line.biz/ja/docs/messaging-api/using-rich-menus/

### 参考リンク
- **LINE Official Account Manager**: https://www.linebiz.com/jp/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

### プロジェクト内ドキュメント
- [LINE公式アカウント設定ガイド](./LINE_OFFICIAL_SETUP_GUIDE.md)
- [Railway デプロイ手順](./RAILWAY_DEPLOYMENT_INSTRUCTIONS.md)
- [LINE設定完了レポート](./LINE_SETUP_COMPLETION_REPORT.md)

---

**🎉 セットアップ完了！LINE公式アカウントによるAI副業サロン運用開始です！**

**🔗 Webhook URL**: https://portal-ir60ihqni-daideguchis-projects.vercel.app/api/line/webhook  
**📱 テスト開始**: LINE公式アカウントフォロー → 「ガイド」送信  
**📊 分析開始**: LINE Official Account Manager + Supabase Dashboard