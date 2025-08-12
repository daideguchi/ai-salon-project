# 🎯 AI副業サロン - Discord完全セットアップガイド

AI副業で月3万円を目指すオンラインサロンのための**完全なDiscord設定手順**です。

## 🎯 必要なもの

- Discordアカウント
- 管理者権限のあるDiscordサーバー（または新規作成）
- 30分程度の時間

## 📋 Step 1: Discord Developer PortalでのBot作成

### 1.1 アプリケーション作成

1. **Discord Developer Portal**にアクセス
   ```
   https://discord.com/developers/applications
   ```

2. **「New Application」**をクリック

3. **アプリケーション名**を入力
   ```
   AI副業サロン Bot
   ```

4. **「Create」**をクリック

### 1.2 Bot設定

1. 左サイドバーの**「Bot」**をクリック
2. **「Add Bot」**をクリック
3. **重要：Botトークンをコピー**
   - 「Token」セクションの**「Copy」**をクリック
   - このトークンを`.env`ファイルの`DISCORD_TOKEN`に設定
   - ⚠️ **絶対に他人に教えないでください**

4. **Bot設定を調整**
   ```
   ✅ PUBLIC BOT: オン（他の人がBotを招待可能）
   ✅ REQUIRES OAUTH2 CODE GRANT: オフ
   ✅ MESSAGE CONTENT INTENT: オン（重要！）
   ✅ SERVER MEMBERS INTENT: オン
   ✅ PRESENCE INTENT: オン
   ```

## 📋 Step 2: Bot権限設定

### 2.1 OAuth2設定

1. 左サイドバーの**「OAuth2」** → **「URL Generator」**をクリック

2. **Scopes**で以下を選択：
   ```
   ✅ bot
   ✅ applications.commands
   ```

3. **Bot Permissions**で以下を選択：
   ```
   General Permissions:
   ✅ Manage Roles
   ✅ Manage Channels
   ✅ View Channels
   ✅ Send Messages
   ✅ Manage Messages
   ✅ Embed Links
   ✅ Attach Files
   ✅ Read Message History
   ✅ Add Reactions
   ✅ Use Slash Commands
   
   Text Permissions:
   ✅ Send Messages in Threads
   ✅ Create Public Threads
   ✅ Create Private Threads
   ✅ Use External Emojis
   ```

## 📋 Step 3: オンラインサロン向けDiscordサーバー準備

### 3.1 サーバー作成

1. Discord左下の**「+」**をクリック
2. **「サーバーを作成」**を選択
3. **「自分用」**を選択
4. サーバー名を入力：
   ```
   AI副業サロン - 月3万円への道
   ```

### 3.2 オンラインサロン専用チャンネル構造

以下のチャンネル構造を**完全に再現**してください：

```
📋 WELCOME & RULES
├── 👋 welcome-and-rules
├── 📢 announcements  
├── 🎯 goal-setting
└── 💬 introduce-yourself

💰 AI副業実践エリア
├── 🎬 youtube-video-ai
├── 📝 blog-automation
├── 📚 kindle-publishing
├── 💻 app-development
└── 🔧 tools-and-tips

🤝 コミュニティ・サポート
├── 💬 general-chat
├── 🆘 help-and-questions
├── 🎉 success-stories
├── 📊 progress-sharing
└── 🤝 collaboration

📈 成長・学習エリア
├── 📰 ai-news
├── 💡 ideas-brainstorm
├── 🧠 skill-development
└── 📖 resources-sharing

🤖 自動化・BOTS
├── 🤖 bot-commands
├── 📊 analytics-reports
├── 🔄 automation-results
└── 📋 task-management

🔒 VIP・プレミアム (有料会員限定)
├── 💎 premium-strategies
├── 🎯 one-on-one-help
├── 📈 advanced-analytics
└── 🚀 exclusive-content
```

### 3.3 チャンネル作成手順

1. **カテゴリ作成**
   - サーバー名を右クリック → 「カテゴリを作成」
   - 名前を入力（例：💰 AI副業実践エリア）

2. **チャンネル作成**
   - カテゴリを右クリック → 「チャンネルを作成」
   - 「テキストチャンネル」を選択
   - 名前を入力（例：🎬 youtube-video-ai）

### 3.4 各チャンネルの目的

**📋 WELCOME & RULES**
- `👋 welcome-and-rules`: サロンルール・利用方法
- `📢 announcements`: 重要なお知らせ
- `🎯 goal-setting`: 個人目標設定・宣言
- `💬 introduce-yourself`: 自己紹介

**💰 AI副業実践エリア**
- `🎬 youtube-video-ai`: AI動画生成による収益化
- `📝 blog-automation`: AI活用ブログ運営
- `📚 kindle-publishing`: Kindle出版ノウハウ
- `💻 app-development`: アプリ開発・アフィリエイト
- `🔧 tools-and-tips`: 便利ツール・テクニック

**🤝 コミュニティ・サポート**
- `💬 general-chat`: 雑談・交流
- `🆘 help-and-questions`: 質問・困った時のサポート
- `🎉 success-stories`: 成功体験の共有
- `📊 progress-sharing`: 進捗報告
- `🤝 collaboration`: コラボレーション募集

**📈 成長・学習エリア**
- `📰 ai-news`: 最新AI情報・ニュース
- `💡 ideas-brainstorm`: アイデア出し・ブレスト
- `🧠 skill-development`: スキルアップ情報
- `📖 resources-sharing`: 学習リソース共有

## 📋 Step 4: 環境変数設定

### 4.1 .envファイル作成

```env
# Discord Bot Configuration（必須）
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
DISCORD_GUILD_ID=YOUR_SERVER_ID_HERE

# AI API Keys（機能を使う場合）
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# YouTube API（動画関連機能用）
YOUTUBE_API_KEY=your_youtube_api_key_here

# サロン管理設定
SALON_MONTHLY_FEE=2980
TRIAL_PERIOD_DAYS=7
TARGET_MONTHLY_INCOME=30000

# 自動化設定
AUTO_WELCOME_MESSAGE=true
SUCCESS_STORY_ALERTS=true
PROGRESS_TRACKING=true
```

## 📋 Step 5: 動作テスト

### 5.1 Bot起動

```bash
python discord_salon_bot.py
```

### 5.2 Discord確認

1. **Botがオンライン**になることを確認
2. **任意のチャンネルで以下をテスト**：
   ```
   /ping
   /salon_status
   /set_goal
   /progress_check
   ```

## 🚨 サロン運営のベストプラクティス

### 会員管理
- 有料会員には `🎯 Premium Member` ロールを付与
- 無料体験中は `🔄 Trial Member` ロール
- 新規参加者には自動で `👋 New Member` ロール

### コンテンツ運営
- 週1回の進捗確認投稿
- 月1回の成功事例ハイライト
- 定期的なAI最新情報共有
- メンバー限定の特別コンテンツ投稿

### エンゲージメント向上
- 目標達成者への特別ロール付与
- 優秀な投稿への反応・ピン留め
- 月間MVP の選出と表彰
- コラボレーション企画の定期開催

## ✅ 完了チェックリスト

- [ ] Discord Developer PortalでBot作成
- [ ] Botトークンを`.env`に設定
- [ ] Bot権限（MESSAGE CONTENT INTENT等）を有効化
- [ ] オンラインサロン専用チャンネルを全て作成
- [ ] サーバーIDを`.env`に設定
- [ ] Botをサーバーに招待
- [ ] 環境変数を全て設定
- [ ] Bot起動テスト成功
- [ ] `/ping`コマンドテスト成功

**🎉 全てチェックできたら、AI副業サロンの準備完了です！**

---

**重要**: この設定により、メンバーが自走して月3万円の副収入を目指せる環境が整います。