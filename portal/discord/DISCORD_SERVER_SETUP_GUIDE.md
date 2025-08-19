# Discord サーバー設定完全ガイド - AI在宅ワーク研究所

## 🎯 目標
「AI副業で月3万円稼ぐコミュニティ」のDiscordサーバーを設定し、ウェブサイトのDiscordボタンから正常にアクセスできるようにする

## 📋 前提条件
- Discordアカウントが必要
- サーバー管理権限
- 招待リンクの管理権限

## 🚀 Step 1: Discordサーバーの作成

### 1.1 Discord.comにログイン
- https://discord.com でログイン
- 左サイドバーの「+」ボタンをクリック
- 「Create My Own」を選択
- 「For a club or community」を選択

### 1.2 サーバー情報設定
```
サーバー名: AI在宅ワーク研究所
サーバーアイコン: AI/ロボット関連のアイコン（🤖など）
```

## 🏗️ Step 2: チャンネル構造の設定

### 2.1 基本チャンネル構成
```
📋 WELCOME & RULES
├── 👋 welcome-and-rules (ルール・利用方法)
├── 📢 announcements (重要お知らせ)
├── 🎯 goal-setting (個人目標設定)
└── 💬 introduce-yourself (自己紹介)

💰 AI副業実践エリア  
├── 🎬 youtube-video-ai (AI動画生成)
├── 📝 blog-automation (ブログ運営)
├── 📚 kindle-publishing (Kindle出版)
├── 💻 app-development (アプリ開発)
└── 🔧 tools-and-tips (ツール・テクニック)

🤝 コミュニティ・サポート
├── 💬 general-chat (雑談・交流)
├── 🆘 help-and-questions (質問・サポート)
├── 🎉 success-stories (成功体験)
├── 📊 progress-sharing (進捗報告)
└── 🤝 collaboration (コラボ募集)

📈 成長・学習エリア
├── 📰 ai-news (最新AI情報)
├── 💡 ideas-brainstorm (アイデア出し)
├── 🧠 skill-development (スキルアップ)
└── 📖 resources-sharing (学習リソース)
```

### 2.2 チャンネル作成コマンド
1. サーバー設定 → チャンネル → 「チャンネルを作成」
2. テキストチャンネルを選択
3. 上記の名前と説明を設定

## 🔗 Step 3: 招待リンクの作成と設定

### 3.1 永続招待リンクの作成
1. 任意のチャンネルで右クリック
2. 「招待を作成」をクリック
3. 「招待リンクを編集」をクリック
4. 以下の設定を行う：

```
期限切れ: なし
最大使用回数: 制限なし  
一時的なメンバーシップ: オフ
カスタムリンク: ai-salon（利用可能な場合）
```

### 3.2 作成された招待リンクの例
```
https://discord.gg/招待コード
または
https://discord.gg/ai-salon (カスタムURLが利用可能な場合)
```

## 🛠️ Step 4: ウェブサイトのDiscord URLを更新

### 4.1 更新が必要なファイル
以下のファイルでDiscord URLを実際の招待リンクに更新:

1. `/app/layout.tsx` (line 64)
2. `/app/page.tsx` (lines 650, 1095, 1396)  
3. `/app/lead-magnets/page.tsx` (line 283)
4. `/app/api/line/webhook/route.ts` (line 86)

### 4.2 URL更新例
```typescript
// 変更前
href="https://discord.gg/ai-salon"

// 変更後（実際の招待リンクに置き換え）
href="https://discord.gg/YOUR_ACTUAL_INVITE_CODE"
```

## 🎭 Step 5: ロールとパーミッションの設定

### 5.1 基本ロール構成
```
🎯 Premium Member (有料会員)
- 全チャンネルアクセス
- VIP専用チャンネルアクセス

🔄 Trial Member (無料体験中)
- 基本チャンネルアクセス
- 一部制限あり

👋 New Member (新規参加者)
- welcome チャンネルのみ
- 自己紹介後にTrial Memberに昇格
```

### 5.2 ロール作成手順
1. サーバー設定 → ロール → 「ロールを作成」
2. 名前と色を設定
3. 権限を適切に設定

## 🤖 Step 6: Botの設定（オプション）

### 6.1 推奨Bot
- **Carl-bot**: 自動役職付与、ウェルカムメッセージ
- **MEE6**: レベルシステム、自動モデレート
- **Dyno**: 基本的なサーバー管理

### 6.2 ウェルカムメッセージ設定
```
🤖 AI在宅ワーク研究所へようこそ！

AI技術を活用して月3万円の副収入を目指すコミュニティです。

📚 まずは #welcome-and-rules でルールを確認
🎯 #goal-setting で目標を設定  
💬 #introduce-yourself で自己紹介をお願いします

⚠️ 誇張なし・現実的な手法のみをお伝えしています。
```

## ✅ Step 7: 動作確認チェックリスト

### 7.1 基本動作確認
- [ ] Discordサーバーが正常に作成されている
- [ ] 招待リンクが正常に機能する
- [ ] 新規メンバーが参加できる
- [ ] チャンネル構造が適切に設定されている

### 7.2 ウェブサイト統合確認
- [ ] 開発サーバー起動: `npm run dev`
- [ ] http://localhost:3002 でアクセス
- [ ] 各ページのDiscordボタンをクリック
- [ ] 正しい招待リンクに移動する
- [ ] Discord参加フローが完了する

### 7.3 最終確認項目
- [ ] Header のDiscordボタン
- [ ] Hero Section のDiscordボタン  
- [ ] Lead Magnets Section のDiscordボタン
- [ ] Final CTA のDiscordボタン
- [ ] Lead Magnets Page ドロップダウンのDiscordボタン

## 🚨 トラブルシューティング

### 問題: 招待リンクが無効
**原因**: リンクの期限切れまたは使用回数制限
**解決**: 新しい永続招待リンクを作成

### 問題: ボタンが機能しない
**原因**: Link コンポーネントの設定ミス
**解決**: `target="_blank"` と正しいURLを確認

### 問題: サーバーに参加できない
**原因**: サーバーの公開設定またはパーミッション
**解決**: サーバー設定でパブリック参加を有効化

## 📝 メンテナンス

### 定期的な確認事項
- 招待リンクの有効性（月1回）
- チャンネルの活用状況確認
- ロールとパーミッションの見直し
- Botの動作状況確認

---

## 🔄 ウェブサイト更新コマンド

実際の招待リンクが取得できたら、以下のコマンドでファイルを一括更新:

```bash
# Discord URL の一括置換（実際の招待コードに置き換えてください）
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|https://discord.gg/ai-salon|https://discord.gg/YOUR_ACTUAL_INVITE_CODE|g'
```

これで完全にDiscordボタンが機能するようになります！