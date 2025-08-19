# 🔑 Channel Access Token 設定手順

## 📋 手順

1. **LINE Developers Console** にアクセス: https://developers.line.biz/console/
2. プロジェクト選択 → チャンネル選択
3. **Messaging API設定**タブ
4. **Channel access token** → 「発行」をクリック
5. 生成されたトークンをコピー

## ✏️ 設定方法

コピーしたトークンで以下のコマンドを実行:

```bash
cd /Users/dd/Desktop/1_dev/ai-salon-project/portal

# 既存の行を置換
sed -i '' 's/LINE_CHANNEL_ACCESS_TOKEN="your_actual_channel_access_token_here"/LINE_CHANNEL_ACCESS_TOKEN="YOUR_COPIED_TOKEN_HERE"/' .env.local
```

または手動で`.env.local`ファイルを編集:
```bash
# before
LINE_CHANNEL_ACCESS_TOKEN="your_actual_channel_access_token_here"

# after (実際のトークンを貼り付け)
LINE_CHANNEL_ACCESS_TOKEN="YOUR_ACTUAL_TOKEN_FROM_LINE_CONSOLE"
```

## 🚀 設定完了後の確認

```bash
# 設定自動化確認
node scripts/setup-line-automation.js

# リッチメニュー作成
node scripts/line-richmenu-setup.js create

# 動作確認
node scripts/test-line-webhook.js
```

## ✅ 成功確認

- 環境変数チェック: 全て✅
- リッチメニュー作成: 成功
- Webhook動作: 正常

## 🎯 運用開始

LINE公式アカウントで以下をテスト:
1. フォロー → ウェルカムメッセージ確認
2. 「ガイド」送信 → 自動応答確認
3. リッチメニュータップ → 動作確認