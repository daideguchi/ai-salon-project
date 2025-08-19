#!/usr/bin/env node

/**
 * Discord サーバー自動設定スクリプト
 * AI在宅ワーク研究所用のDiscordサーバーセットアップを自動化
 */

const fs = require('fs');
const path = require('path');

class DiscordServerSetup {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.discordConfig = {
      serverName: 'AI在宅ワーク研究所',
      serverDescription: 'AI技術を活用して月3万円の副収入を目指すコミュニティ',
      channels: this.getChannelStructure(),
      roles: this.getRoleStructure(),
      inviteSettings: {
        maxAge: 0, // 無期限
        maxUses: 0, // 無制限
        temporary: false,
        unique: false
      }
    };
  }

  /**
   * チャンネル構造を定義
   */
  getChannelStructure() {
    return [
      {
        category: 'WELCOME & RULES',
        channels: [
          {
            name: 'welcome-and-rules',
            type: 'text',
            description: 'サロンルール・利用方法',
            topic: '🎯 AI副業で月3万円を目指すコミュニティへようこそ！まずはルールをご確認ください。'
          },
          {
            name: 'announcements',
            type: 'text',
            description: '重要なお知らせ',
            topic: '📢 重要な情報をお知らせします。通知をオンにすることをおすすめします。'
          },
          {
            name: 'goal-setting',
            type: 'text',
            description: '個人目標設定・宣言',
            topic: '🎯 あなたの目標を宣言して、みんなで応援し合いましょう！'
          },
          {
            name: 'introduce-yourself',
            type: 'text',
            description: '自己紹介',
            topic: '💬 簡単な自己紹介をお願いします。どんな副業に興味があるかも教えてください！'
          }
        ]
      },
      {
        category: 'AI副業実践エリア',
        channels: [
          {
            name: 'youtube-video-ai',
            type: 'text',
            description: 'AI動画生成による収益化',
            topic: '🎬 Sora、Runway、Pikaなどを使った動画制作ノウハウを共有しましょう！'
          },
          {
            name: 'blog-automation',
            type: 'text',
            description: 'AI活用ブログ運営',
            topic: '📝 ChatGPT×ブログで月3万円を目指す実践的な情報交換の場です。'
          },
          {
            name: 'kindle-publishing',
            type: 'text',
            description: 'Kindle出版ノウハウ',
            topic: '📚 AIライティングを活用したKindle出版で印税収入を目指しましょう！'
          },
          {
            name: 'app-development',
            type: 'text',
            description: 'アプリ開発・アフィリエイト',
            topic: '💻 ノーコード・ローコードでのアプリ開発や収益化について話し合いましょう。'
          },
          {
            name: 'tools-and-tips',
            type: 'text',
            description: '便利ツール・テクニック',
            topic: '🔧 作業効率を上げるツールやテクニックを共有する場です。'
          }
        ]
      },
      {
        category: 'コミュニティ・サポート',
        channels: [
          {
            name: 'general-chat',
            type: 'text',
            description: '雑談・交流',
            topic: '💬 日常の雑談や情報交換を楽しく行いましょう！'
          },
          {
            name: 'help-and-questions',
            type: 'text',
            description: '質問・困った時のサポート',
            topic: '🆘 分からないことがあれば遠慮なく質問してください。みんなでサポートします！'
          },
          {
            name: 'success-stories',
            type: 'text',
            description: '成功体験の共有',
            topic: '🎉 小さな成功でも大歓迎！みんなで喜びを分かち合いましょう。'
          },
          {
            name: 'progress-sharing',
            type: 'text',
            description: '進捗報告',
            topic: '📊 今日の作業や進捗を報告して、お互いに励まし合いましょう。'
          },
          {
            name: 'collaboration',
            type: 'text',
            description: 'コラボレーション募集',
            topic: '🤝 一緒にプロジェクトを進めたい方の募集や相談はこちら！'
          }
        ]
      },
      {
        category: '成長・学習エリア',
        channels: [
          {
            name: 'ai-news',
            type: 'text',
            description: '最新AI情報・ニュース',
            topic: '📰 副業に使えそうな新しいAI技術やニュースを共有しましょう。'
          },
          {
            name: 'ideas-brainstorm',
            type: 'text',
            description: 'アイデア出し・ブレスト',
            topic: '💡 新しいアイデアをみんなで出し合って、可能性を探りましょう！'
          },
          {
            name: 'skill-development',
            type: 'text',
            description: 'スキルアップ情報',
            topic: '🧠 技術習得や自己成長に関する情報を共有する場です。'
          },
          {
            name: 'resources-sharing',
            type: 'text',
            description: '学習リソース共有',
            topic: '📖 役立つ記事、動画、書籍などの学習リソースを共有しましょう。'
          }
        ]
      }
    ];
  }

  /**
   * ロール構造を定義
   */
  getRoleStructure() {
    return [
      {
        name: '🎯 Premium Member',
        color: '#F1C40F',
        permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        description: '有料会員 - 全チャンネルアクセス可能'
      },
      {
        name: '🔄 Trial Member', 
        color: '#3498DB',
        permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        description: '無料体験中 - 基本チャンネルアクセス'
      },
      {
        name: '👋 New Member',
        color: '#95A5A6',
        permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
        description: '新規参加者 - 制限付きアクセス'
      }
    ];
  }

  /**
   * セットアップ手順を生成
   */
  generateSetupInstructions() {
    const instructions = `
# 🤖 AI在宅ワーク研究所 Discord サーバー設定手順

## 📋 自動生成された設定内容

### サーバー基本情報
- **名前**: ${this.discordConfig.serverName}
- **説明**: ${this.discordConfig.serverDescription}

### チャンネル構造
${this.discordConfig.channels.map(category => `
**${category.category}**
${category.channels.map(channel => `- #${channel.name} (${channel.description})`).join('\n')}
`).join('\n')}

### ロール設定
${this.discordConfig.roles.map(role => `- **${role.name}**: ${role.description}`).join('\n')}

## 🚀 設定手順

### Step 1: Discord サーバー作成
1. Discord.com にログイン
2. 左サイドバーの「+」をクリック
3. 「Create My Own」→「For a club or community」を選択
4. サーバー名を「${this.discordConfig.serverName}」に設定

### Step 2: チャンネル作成
${this.discordConfig.channels.map((category, categoryIndex) => `
${categoryIndex + 1}. カテゴリ「${category.category}」を作成
${category.channels.map((channel, channelIndex) => `   ${categoryIndex + 1}.${channelIndex + 1}. チャンネル「${channel.name}」を作成
   - 説明: ${channel.description}
   - トピック: ${channel.topic || 'なし'}`).join('\n')}
`).join('\n')}

### Step 3: ロール作成
${this.discordConfig.roles.map((role, index) => `${index + 1}. ロール「${role.name}」を作成
   - 色: ${role.color}
   - 説明: ${role.description}`).join('\n')}

### Step 4: 招待リンク作成
1. 任意のチャンネルで右クリック
2. 「招待を作成」をクリック
3. 以下の設定:
   - 期限切れ: なし
   - 最大使用回数: 制限なし
   - 一時的なメンバーシップ: オフ

### Step 5: ウェブサイト URL 更新
作成した招待リンクを以下のコマンドで一括更新:

\`\`\`bash
# YOUR_INVITE_CODE を実際の招待コードに置き換え
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|https://discord.gg/openai|https://discord.gg/YOUR_INVITE_CODE|g'
\`\`\`

## ✅ 確認事項
- [ ] サーバーが正常に作成されている
- [ ] 全チャンネルが作成されている
- [ ] ロールが適切に設定されている
- [ ] 招待リンクが機能している
- [ ] ウェブサイトのボタンが正しく動作している

生成日時: ${new Date().toLocaleString('ja-JP')}
`;

    return instructions;
  }

  /**
   * Discord Bot用のウェルカムメッセージテンプレートを生成
   */
  generateWelcomeMessage() {
    return {
      embeds: [{
        title: '🤖 AI在宅ワーク研究所へようこそ！',
        description: 'AI技術を活用して月3万円の副収入を目指すコミュニティです。',
        color: 0x3498DB,
        fields: [
          {
            name: '📚 まずはこちらから',
            value: '• <#welcome-and-rules> でルールを確認\n• <#goal-setting> で目標を設定\n• <#introduce-yourself> で自己紹介',
            inline: false
          },
          {
            name: '🎯 コミュニティの特徴',
            value: '• 誇張なし・現実的な手法のみ\n• 失敗談も含めた正直な情報共有\n• 月3万円の現実的な目標設定',
            inline: false
          },
          {
            name: '💡 始め方',
            value: '興味のある分野のチャンネルを覗いてみてください！\n質問があれば <#help-and-questions> でお気軽にどうぞ。',
            inline: false
          }
        ],
        footer: {
          text: 'AI在宅ワーク研究所 - 誠実な情報共有コミュニティ'
        },
        timestamp: new Date().toISOString()
      }]
    };
  }

  /**
   * 実行メイン関数
   */
  async run() {
    console.log('🚀 Discord サーバー自動設定スクリプトを開始...\n');

    // 設定ファイルの生成
    const setupInstructions = this.generateSetupInstructions();
    const instructionsPath = path.join(this.projectRoot, 'discord', 'AUTO_GENERATED_SETUP_INSTRUCTIONS.md');
    
    // ディレクトリが存在しない場合は作成
    const discordDir = path.dirname(instructionsPath);
    if (!fs.existsSync(discordDir)) {
      fs.mkdirSync(discordDir, { recursive: true });
    }

    // ファイル書き込み
    fs.writeFileSync(instructionsPath, setupInstructions, 'utf8');
    console.log(`✅ セットアップ手順を生成: ${instructionsPath}`);

    // ウェルカムメッセージの生成
    const welcomeMessage = this.generateWelcomeMessage();
    const welcomePath = path.join(this.projectRoot, 'discord', 'welcome_message.json');
    fs.writeFileSync(welcomePath, JSON.stringify(welcomeMessage, null, 2), 'utf8');
    console.log(`✅ ウェルカムメッセージを生成: ${welcomePath}`);

    // 設定概要の出力
    console.log('\n📋 生成された設定概要:');
    console.log(`- サーバー名: ${this.discordConfig.serverName}`);
    console.log(`- チャンネル数: ${this.discordConfig.channels.reduce((sum, cat) => sum + cat.channels.length, 0)}`);
    console.log(`- カテゴリ数: ${this.discordConfig.channels.length}`);
    console.log(`- ロール数: ${this.discordConfig.roles.length}`);

    console.log('\n🎯 次のステップ:');
    console.log('1. 生成されたセットアップ手順に従ってDiscordサーバーを作成');
    console.log('2. 招待リンク取得後、URL更新コマンドを実行');
    console.log('3. ウェブサイトでボタンの動作確認');

    console.log('\n✨ セットアップスクリプト完了！');
  }
}

// スクリプト実行
if (require.main === module) {
  const setup = new DiscordServerSetup();
  setup.run().catch(console.error);
}

module.exports = DiscordServerSetup;