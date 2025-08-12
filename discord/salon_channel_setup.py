#!/usr/bin/env python3
"""
AI副業サロン専用 Discord チャンネル構造セットアップ
月3万円の副収入を目指すオンラインサロン向け最適化
"""

import os
import sys
import asyncio
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

class SalonSetupBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.members = True
        
        super().__init__(
            command_prefix='!salon ',
            intents=intents,
            description='AI副業サロン Discord Setup Bot'
        )
    
    async def on_ready(self):
        print(f'✅ {self.user} でログインしました！')
        print(f'サーバー数: {len(self.guilds)}')
        
        for guild in self.guilds:
            print(f'📍 サーバー: {guild.name} (ID: {guild.id})')
            await self.setup_salon_structure(guild)
    
    async def setup_salon_structure(self, guild):
        """AI副業サロン専用チャンネル構造を作成"""
        
        # AI副業サロン専用チャンネル構造
        salon_structure = {
            # 📋 WELCOME & RULES
            "📋-WELCOME-&-RULES": {
                "type": "category",
                "channels": [
                    {"name": "👋-welcome-and-rules", "topic": "サロンのルール・利用方法・重要事項"},
                    {"name": "📢-announcements", "topic": "重要なお知らせ・サロン運営情報"},
                    {"name": "🎯-goal-setting", "topic": "月3万円への個人目標設定・宣言"},
                    {"name": "💬-introduce-yourself", "topic": "自己紹介・お互いを知ろう"},
                ]
            },
            
            # 💰 AI副業実践エリア
            "💰-AI副業実践エリア": {
                "type": "category", 
                "channels": [
                    {"name": "🎬-youtube-video-ai", "topic": "AI動画生成による収益化ノウハウ・実践報告"},
                    {"name": "📝-blog-automation", "topic": "AI活用ブログ運営・SEO・アフィリエイト"},
                    {"name": "📚-kindle-publishing", "topic": "Kindle出版・電子書籍作成での収益化"},
                    {"name": "💻-app-development", "topic": "アプリ開発・プログラミング収益化"},
                    {"name": "🔧-tools-and-tips", "topic": "便利なAIツール・テクニック・裏技"},
                ]
            },
            
            # 🤝 コミュニティ・サポート
            "🤝-コミュニティ・サポート": {
                "type": "category",
                "channels": [
                    {"name": "💬-general-chat", "topic": "雑談・交流・何でも気軽に話そう"},
                    {"name": "🆘-help-and-questions", "topic": "質問・困った時のサポート・助け合い"},
                    {"name": "🎉-success-stories", "topic": "成功体験・達成報告・みんなで祝おう"},
                    {"name": "📊-progress-sharing", "topic": "進捗報告・週次月次の振り返り"},
                    {"name": "🤝-collaboration", "topic": "コラボレーション募集・共同プロジェクト"},
                ]
            },
            
            # 📈 成長・学習エリア
            "📈-成長・学習エリア": {
                "type": "category",
                "channels": [
                    {"name": "📰-ai-news", "topic": "最新AI情報・ニュース・トレンド"},
                    {"name": "💡-ideas-brainstorm", "topic": "アイデア出し・ブレインストーミング"},
                    {"name": "🧠-skill-development", "topic": "スキルアップ情報・学習法・成長戦略"},
                    {"name": "📖-resources-sharing", "topic": "学習リソース・参考書籍・動画シェア"},
                ]
            },
            
            # 🤖 自動化・BOTS
            "🤖-自動化・BOTS": {
                "type": "category",
                "channels": [
                    {"name": "🤖-bot-commands", "topic": "Bot コマンド・自動化機能の使い方"},
                    {"name": "📊-analytics-reports", "topic": "自動生成レポート・収益分析"},
                    {"name": "🔄-automation-results", "topic": "自動化スクリプトの実行結果"},
                    {"name": "📋-task-management", "topic": "タスク管理・進捗自動追跡"},
                ]
            },
            
            # 🔒 VIP・プレミアム
            "🔒-VIP・プレミアム": {
                "type": "category",
                "channels": [
                    {"name": "💎-premium-strategies", "topic": "有料会員限定の高度な戦略・ノウハウ"},
                    {"name": "🎯-one-on-one-help", "topic": "個別サポート・パーソナルアドバイス"},
                    {"name": "📈-advanced-analytics", "topic": "詳細分析・上級者向けデータ"},
                    {"name": "🚀-exclusive-content", "topic": "限定コンテンツ・特別情報"},
                ]
            }
        }
        
        print(f"\n🔧 {guild.name} をAI副業サロン仕様に最適化中...")
        
        for category_name, category_data in salon_structure.items():
            # カテゴリを作成または取得
            category = discord.utils.get(guild.categories, name=category_name)
            if not category:
                try:
                    category = await guild.create_category(category_name)
                    print(f"✅ カテゴリ作成: {category_name}")
                except discord.Forbidden:
                    print(f"❌ カテゴリ作成権限なし: {category_name}")
                    continue
                except Exception as e:
                    print(f"❌ カテゴリ作成エラー: {category_name} - {e}")
                    continue
            
            # チャンネルを作成
            for channel_info in category_data["channels"]:
                channel_name = channel_info["name"]
                channel_topic = channel_info["topic"]
                
                # 既存チャンネルをチェック
                existing_channel = discord.utils.get(guild.channels, name=channel_name)
                if not existing_channel:
                    try:
                        await guild.create_text_channel(
                            channel_name,
                            category=category,
                            topic=channel_topic
                        )
                        print(f"  ✅ チャンネル作成: #{channel_name}")
                        await asyncio.sleep(1)  # レート制限対策
                    except discord.Forbidden:
                        print(f"  ❌ チャンネル作成権限なし: #{channel_name}")
                    except Exception as e:
                        print(f"  ❌ チャンネル作成エラー: #{channel_name} - {e}")
                else:
                    print(f"  ℹ️  既存チャンネル: #{channel_name}")
        
        # ロール作成
        await self.setup_salon_roles(guild)
        
        print(f"🎉 {guild.name} のAI副業サロン構造最適化完了！")
        
        # 使い方ガイドを投稿
        await self.post_salon_guide(guild)
    
    async def setup_salon_roles(self, guild):
        """サロン専用ロールを作成"""
        
        salon_roles = [
            {"name": "🎯 Premium Member", "color": 0xffd700, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🔄 Trial Member", "color": 0x87ceeb, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "👋 New Member", "color": 0x90ee90, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🏆 Success Achiever", "color": 0xff6347, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "📈 Progress Tracker", "color": 0x9370db, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🤝 Collaborator", "color": 0x20b2aa, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
        ]
        
        for role_info in salon_roles:
            existing_role = discord.utils.get(guild.roles, name=role_info["name"])
            if not existing_role:
                try:
                    await guild.create_role(
                        name=role_info["name"],
                        color=role_info["color"],
                        permissions=role_info["permissions"]
                    )
                    print(f"✅ ロール作成: {role_info['name']}")
                except Exception as e:
                    print(f"❌ ロール作成エラー: {role_info['name']} - {e}")
            else:
                print(f"ℹ️  既存ロール: {role_info['name']}")
    
    async def post_salon_guide(self, guild):
        """AI副業サロン使い方ガイドを投稿"""
        
        welcome_channel = discord.utils.get(guild.channels, name="👋-welcome-and-rules")
        if welcome_channel:
            embed = discord.Embed(
                title="🎉 AI副業サロンへようこそ！",
                description="月3万円の副収入を目指すAI活用コミュニティ",
                color=0x00ff88
            )
            
            embed.add_field(
                name="🎯 サロンの目標",
                value="""
• **月3万円の副収入達成**
• **AI技術を活用した副業スキル習得** 
• **自走できるコミュニティ形成**
• **仲間との情報共有・切磋琢磨**
                """,
                inline=False
            )
            
            embed.add_field(
                name="💰 主な副業分野",
                value="""
• **🎬 YouTube動画**: AI動画生成による収益化
• **📝 ブログ運営**: AI活用SEO・アフィリエイト
• **📚 Kindle出版**: 電子書籍作成・販売
• **💻 アプリ開発**: プログラミング・収益化
• **🔧 便利ツール**: 効率化・自動化術
                """,
                inline=False
            )
            
            embed.add_field(
                name="🤖 Bot コマンド",
                value="""
• `/goal_set` - 月間目標設定
• `/progress_check` - 進捗確認
• `/success_share` - 成功体験投稿
• `/help_request` - サポート依頼
• `/collaboration` - コラボ募集
                """,
                inline=False
            )
            
            embed.add_field(
                name="🏆 ロールシステム",
                value="""
• **🎯 Premium Member**: 有料会員
• **🔄 Trial Member**: 無料体験中
• **🏆 Success Achiever**: 目標達成者
• **📈 Progress Tracker**: 進捗共有活発
• **🤝 Collaborator**: コラボ積極参加
                """,
                inline=False
            )
            
            try:
                await welcome_channel.send(embed=embed)
                print("✅ サロンガイド投稿完了")
            except Exception as e:
                print(f"❌ サロンガイド投稿エラー: {e}")

async def main():
    """メイン実行関数"""
    bot = SalonSetupBot()
    
    # Discord Token - 環境変数から取得
    token = os.getenv('DISCORD_TOKEN')
    
    if not token:
        print("❌ DISCORD_TOKEN が設定されていません")
        return
    
    try:
        await bot.start(token)
    except KeyboardInterrupt:
        print("\n🛑 セットアップを中断しました")
    except Exception as e:
        print(f"❌ エラー: {e}")
    finally:
        await bot.close()

if __name__ == "__main__":
    print("🎯 AI副業サロン Discord セットアップツール")
    print("月3万円の副収入を目指すコミュニティ構築中...")
    print("=" * 60)
    asyncio.run(main())