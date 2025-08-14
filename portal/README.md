# 🌐 AI在宅ワーク研究所 ポータルサイト

Next.js 14で構築されたリードマグネット配布ポータルサイトです。

## ✅ 機能

- 🎁 **6つのリードマグネット配布**: AI動画、Kindle、ブログ、プロンプト集、ロードマップ、時間管理術
- 🔐 **Discord認証システム**: メンバー限定特典アクセス
- 💎 **プレミアム機能**: 有料会員限定コンテンツ
- 📊 **ダウンロード追跡**: 利用状況分析
- 🎯 **JWT認証**: 24時間有効なセキュアリンク

## 🚀 Vercelデプロイ手順

### 1. 環境変数設定
Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL="https://hetcpqtsineqaopnnvtn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_actual_anon_key"
SUPABASE_SECRET_KEY="your_actual_secret_key"
JWT_SECRET="ai-salon-portal-jwt-secret-2025"
NEXT_PUBLIC_SITE_URL="https://your-app.vercel.app"
NEXT_PUBLIC_SITE_NAME="AI在宅ワーク研究所"
```

### 2. Supabaseデータベース設定
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `scripts/create-supabase-tables.sql`の内容を実行
3. テーブル作成・RLS設定・テストデータ挿入が完了

### 3. Vercelデプロイ
1. GitHubリポジトリをVercelに接続
2. Root Directoryを `portal` に設定
3. Framework Preset: `Next.js`
4. デプロイ実行

## 🔧 ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

## 📁 ディレクトリ構造

```
portal/
├── app/                 # Next.js App Router
├── lib/                 # ユーティリティ・Supabase設定
├── scripts/             # データベース設定SQL
├── .env.example         # 環境変数テンプレート
└── package.json         # 依存関係定義
```

## 🎯 利用可能なリードマグネット

1. 🎬 **AI動画作成スターターキット** - 7日計画・収益化ガイド
2. 📚 **Kindle出版完全攻略ガイド** - 30日で初出版実現
3. 📝 **ブログ収益化テンプレート集** - SEO・アフィリエイト最適化
4. 🤖 **AIプロンプト集（副業特化50選）** - 即使える実用プロンプト
5. 🎯 **月3万円達成90日ロードマップ** - 確実な目標達成計画
6. ⏰ **副業時間管理術** - 週10時間で本業両立（プレミアム）

## 🛡️ セキュリティ機能

- Row Level Security (RLS) 有効
- JWT トークンによる認証
- Discord メンバー検証
- 24時間有効期限付きダウンロード

## 📊 モックデータ対応

Supabaseデータベース未設定時も、モックデータで正常動作します。
データベース接続後は自動的にSupabaseデータに切り替わります。

---

**🎯 目標**: AI在宅ワーク研究所メンバーに価値ある特典を効率的に配布