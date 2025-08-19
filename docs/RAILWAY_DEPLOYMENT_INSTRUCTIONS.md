# 🚂 Railway Deployment Instructions - AI副業サロンプロジェクト

**作成日**: 2025-08-17  
**プロジェクト**: ai-salon-portal  
**プロジェクトURL**: https://railway.app/project/1bfdbe09-5415-4c27-8535-1a16c1633f2d  
**デプロイURL**: https://ai-salon-portal-production.up.railway.app

---

## 🎯 手動設定が必要な理由

Railway CLIでサービスリンクエラーが発生しているため、Railwayダッシュボードでの手動設定が最も確実です。

---

## 📋 STEP 1: Railwayダッシュボード設定

### 1. プロジェクトアクセス
以下のURLにアクセス:
```
https://railway.app/project/1bfdbe09-5415-4c27-8535-1a16c1633f2d
```

### 2. サービス確認・作成
- 左サイドバーで「Services」を確認
- 既存サービスが表示されない場合、「+ Create」で新しいサービス作成
- Service Name: `ai-salon-portal`

### 3. GitHub接続設定
- 「Connect GitHub Repo」をクリック
- リポジトリ選択: `daideguchi/ai-salon-project`
- Root Directory: `portal` (**重要**)
- Branch: `main`

---

## 🔧 STEP 2: 環境変数設定

### Variables タブで以下を設定:

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://gfuuybvyunfbuvsfogid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXV5YnZ5dW5mYnV2c2ZvZ2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA0MjcsImV4cCI6MjA3MDc3NjQyN30.fyW-2YSKbdGfIlPO1H0yJUaDtwJKGK68h7Kfv7hKpsY

# Next.js設定
JWT_SECRET=ai-salon-portal-jwt-secret-2025
NEXT_PUBLIC_SITE_URL=https://ai-salon-portal-production.up.railway.app
NEXT_PUBLIC_SITE_NAME=AI在宅ワーク研究所

# LINE公式アカウント（後で設定）
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
LINE_CHANNEL_SECRET=your_line_channel_secret_here
LINE_RICH_MENU_ID=

# Discord（オプション）
DISCORD_BOT_TOKEN=your_discord_bot_token_here
```

---

## ⚡ STEP 3: ビルド設定確認

### Settings > Environment で確認:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Node.js Version**: 18.x or 20.x

### railway.json 設定済み:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🚀 STEP 4: デプロイ実行

### 自動デプロイトリガー:
1. 環境変数設定完了後
2. 「Deploy」ボタンクリック
3. ビルドログ確認

### 期待される結果:
- ✅ ビルド成功（約2-3分）
- ✅ デプロイ成功
- ✅ https://ai-salon-portal-production.up.railway.app でアクセス可能
- ✅ `/api/line/webhook` エンドポイント動作

---

## 🔍 STEP 5: 動作確認

### 基本動作テスト:
```bash
# TOPページ確認
curl -X GET https://ai-salon-portal-production.up.railway.app/

# LINE Webhook エンドポイント確認
curl -X GET https://ai-salon-portal-production.up.railway.app/api/line/webhook
```

### 期待される応答:
- TOP: Next.jsアプリケーションの表示
- Webhook: LINE Bot認証エラー（正常、LINE設定待ち）

---

## 📱 STEP 6: LINE Webhook URL設定

### デプロイ成功後、LINE Developers Consoleで設定:

```
Webhook URL: https://ai-salon-portal-production.up.railway.app/api/line/webhook
Use webhook: ON
```

---

## 🚨 トラブルシューティング

### よくある問題と解決法:

#### 1. ビルドエラー
```
Solution: Environment変数が設定されているか確認
```

#### 2. 404エラー
```
Solution: Root Directoryが"portal"に設定されているか確認
```

#### 3. 環境変数エラー
```
Solution: NEXT_PUBLIC_* 変数が正しく設定されているか確認
```

#### 4. メモリ不足
```
Solution: Settingsでメモリ制限を2GB以上に変更
```

---

## 📋 チェックリスト

### デプロイ前確認:
- [ ] GitHubリポジトリ接続済み
- [ ] Root Directory = "portal"
- [ ] 必要な環境変数すべて設定済み
- [ ] railway.json配置済み

### デプロイ後確認:
- [ ] ビルド成功
- [ ] TOPページアクセス可能
- [ ] LINE Webhook エンドポイント存在
- [ ] ログエラーなし

### LINE連携確認:
- [ ] Webhook URL設定済み
- [ ] Channel Access Token設定済み
- [ ] リッチメニュー作成済み
- [ ] テストメッセージ送信成功

---

**💡 次ステップ**: 
1. 上記手順実行
2. デプロイ成功確認
3. LINE公式アカウント設定
4. テスト・運用開始

**🔗 関連ドキュメント**:
- [LINE公式アカウント設定ガイド](./LINE_OFFICIAL_SETUP_GUIDE.md)
- [LINE設定完了レポート](./LINE_SETUP_COMPLETION_REPORT.md)