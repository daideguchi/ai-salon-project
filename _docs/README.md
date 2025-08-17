# 🏛️ AI在宅ワーク研究所 - 完全統合システム

> **月3万円の副収入を『自走』して稼げる研究員を育成するコミュニティ**  
> Discord + 特典配布ポータル統合プロジェクト

## 📋 プロジェクト概要

AI在宅ワーク研究所は、AIツールを活用した副業で月3万円の安定収入を目指すコミュニティです。本プロジェクトは以下の2つのシステムを統合しています：

1. **Discord コミュニティ管理システム** - 研究員同士の交流・サポート
2. **特典配布ポータル** - プレミアム研究員向け限定コンテンツ配布

## 🎯 核心コンセプト

### 🔬 研究所モデル
- **所長** - コミュニティ運営者（最高責任者）
- **研究員** - コミュニティメンバー（基本プラン）
- **プレミアム研究員** - 月額480円の有料プラン

### 💡 基本理念
- **心理的安全性** - 失敗も成功も等しく価値ある研究データ
- **検証重視** - 憶測ではなくデータに基づく手法の確立
- **協力関係** - 競争ではなく協力で全員が成長
- **継続性** - 短期爆益より長期安定収入の確立

## 🚀 システム構成

### 📁 プロジェクト構造
```
ai-salon-project/
├── 📂 discord/              # Discord Bot関連
│   ├── cleanup_and_setup.py      # サーバー構造整理
│   ├── fix_premium_permissions.py # プレミアム権限設定
│   └── update_server_branding.py  # サーバー名・説明更新
├── 📂 branding/             # コミュニティブランディング
│   ├── community_branding.md      # ミッション・ビジョン
│   ├── channel_usage_guide.md     # チャンネル使い方
│   ├── pricing_membership_guide.md # 料金・プラン詳細
│   ├── community_rules_terms.md   # ルール・利用規約
│   └── templates_faq_resources.md # FAQ・テンプレート集
├── 📂 portal/               # 特典配布ポータル（Next.js）
│   ├── app/                       # Next.js App Router
│   ├── lib/                       # ユーティリティ・設定
│   ├── supabase-schema.sql        # データベース設計
│   └── package.json               # 依存関係・スクリプト
├── .env                     # 環境変数（統合設定）
└── README.md               # このファイル
```

### 🛠️ 技術スタック

#### Discord システム
- **Python 3.13+** - Discord Bot開発
- **discord.py** - Discord API クライアント
- **環境管理** - dotenv

#### 特典配布ポータル
- **Next.js 14** - React フレームワーク（App Router）
- **TypeScript** - 型安全な開発
- **TailwindCSS** - UI スタイリング
- **Supabase** - データベース・認証・ストレージ
- **JWT (jose)** - セキュアなダウンロードリンク
- **UUID** - ユニークID生成

## ⚙️ セットアップガイド

### 1. 環境準備
```bash
# リポジトリクローン
git clone [repository-url]
cd ai-salon-project

# 環境変数設定
cp .env.example .env
# .env ファイルを実際の値で編集
```

### 2. Discord Bot セットアップ
```bash
# Python 仮想環境作成
python3 -m venv discord_env
source discord_env/bin/activate

# 依存関係インストール
pip install discord.py python-dotenv

# Discord Bot 実行
python discord/update_server_branding.py
```

### 3. 特典配布ポータル セットアップ
```bash
# Node.js 環境（推奨: Node 18+）
cd portal

# 依存関係インストール
npm install

# Supabase データベースセットアップ
# supabase-schema.sql を Supabase プロジェクトで実行

# 開発サーバー起動
npm run dev
```

## 🎮 使用方法

### Discord コミュニティ管理

#### サーバー初期化
```bash
# チャンネル構造整理（58→9チャンネル）
python discord/cleanup_and_setup.py

# プレミアム権限設定
python discord/fix_premium_permissions.py
```

#### チャンネル構成（9チャンネル）
1. **📋-はじめに** - ルール・使い方
2. **💬-雑談ラウンジ** - 自由な交流
3. **👋-自己紹介** - 新規研究員の紹介
4. **❓-質問・相談** - 技術的な相談
5. **📈-成果報告** - 収益・学習成果の共有
6. **💡-ツール・情報共有** - 新ツール・手法の情報
7. **🏛️-所長からのお知らせ** - 重要なお知らせ
8. **🎪-イベント告知** - 勉強会・コンサル開催
9. **💎-プレミアム研究室** - 有料プラン限定

### 特典配布ポータル

#### アクセス手順
1. **http://localhost:3001** にアクセス（開発環境）
2. 特典パックを選択
3. Discord情報で認証
4. 24時間有効なダウンロードリンク取得

#### セキュリティ機能
- **JWT トークン** - セキュアなダウンロードリンク
- **プレミアム認証** - Discord ロールベース権限確認
- **ダウンロード追跡** - 利用状況の完全記録

## 💰 料金プラン

### 🆓 基本プラン（無料）
- 8つの基本チャンネルアクセス
- 研究員同士の交流
- 基本的なテンプレート・プロンプト集
- 公開質問への所長回答

### 💎 プレミアム研究員（月額480円）
- **基本プラン** + 以下の特典
- プレミアム研究室アクセス
- 週1回の個別フィードバック
- 月2回のグループコンサル
- 限定プロンプト・テンプレート集
- 新ツール・手法の先行情報
- 特典配布ポータルの全機能

## 🎯 成果指標

### 実績データ
- **基本プラン平均月収**: 3,000円～15,000円
- **プレミアム平均月収**: 25,000円～80,000円
- **プレミアム成功率**: 70%が3ヶ月以内に月3万円達成

### 主要な収益手法
- 記事・コンテンツ作成（500円～5,000円/件）
- デザイン作業（1,000円～10,000円/件）
- データ入力・整理（時給800円～1,500円）
- YouTube企画・台本作成（2,000円～20,000円/件）

## 🛡️ セキュリティ・規約

### 個人情報保護
- 最小限のデータ収集（Discord情報のみ）
- 外部決済サービス利用（PayPal, Stripe）
- データ削除権の保証

### 利用規約
- 18歳以上（高校生は保護者同意必要）
- 日本語でのコミュニケーション必須
- 副業・スキルアップ目的の利用
- 違法行為・反社会的行為の禁止

## 🆘 サポート・お問い合わせ

### 一般的な質問
- **Discord**: #❓-質問・相談チャンネル
- **対応時間**: 平日9:00-18:00
- **回答時間**: 24時間以内

### 緊急事項・個別相談
- **所長直接DM**: Discord内メッセージ
- **メール**: ai.salon.director@gmail.com
- **対応時間**: 24時間以内返信

### 技術的問題
- **システム障害**: GitHub Issues
- **決済トラブル**: 各決済サービスサポート併用

## 🚀 将来の拡張計画

### Phase 2（3ヶ月以内）
- モバイルアプリ対応
- 自動化ツールの追加
- 成果分析ダッシュボード

### Phase 3（6ヶ月以内）
- AI コンサルタント機能
- 法人向けプラン
- 国際展開（英語対応）

## 📊 システム要件

### サーバー要件
- **Node.js**: 18.0以上
- **Python**: 3.9以上
- **PostgreSQL**: 13以上（Supabase）
- **メモリ**: 2GB以上

### 開発環境
- **OS**: macOS, Linux, Windows
- **エディタ**: VS Code推奨
- **ブラウザ**: Chrome, Firefox, Safari

## 📄 ライセンス・著作権

- **コードライセンス**: MIT License
- **コンテンツ著作権**: AI在宅ワーク研究所
- **商標**: AI在宅ワーク研究所™

---

## 🎉 貢献者・謝辞

### 開発チーム
- **所長**: プロダクト企画・運営
- **Claude Code**: システム設計・開発
- **GPT-5**: アーキテクチャ設計・コンセプト構築

### 特別謝辞
- **研究員の皆様**: フィードバック・テスト協力
- **Discord コミュニティ**: 成長・改善への協力
- **オープンソースコミュニティ**: 技術基盤提供

### 関連リンク・リソース
1. サロン基本設計: https://docs.google.com/spreadsheets/d/1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g/edit?usp=sharing
2. 無料特典設計: https://docs.google.com/spreadsheets/d/1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs/edit?usp=sharing
3. 有料コンテンツ: https://docs.google.com/spreadsheets/d/1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ/edit?usp=sharing
4. 壁打ちログ: https://docs.google.com/spreadsheets/d/1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI/edit?usp=sharing

---

**🏛️ AI在宅ワーク研究所**  
**更新日**: 2025-08-12  
**バージョン**: v1.0.0  
**次回更新予定**: 2025-09-12