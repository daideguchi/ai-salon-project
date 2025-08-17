#!/usr/bin/env python3
"""
AI在宅ワーク研究所 Discord サーバークリーンアップ＆シンプル構築
複雑になったサーバーを整理して、9チャンネルのシンプル構成に統一
"""

import asyncio
import discord
from discord.ext import commands
from dotenv import load_dotenv
import os

load_dotenv(override=True)

class CleanupAndSetup(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.members = True
        
        super().__init__(
            command_prefix='!cleanup ',
            intents=intents,
            description='AI在宅ワーク研究所 クリーンアップBot'
        )
    
    async def on_ready(self):
        print(f'✅ {self.user} でログインしました')
        
        for guild in self.guilds:
            print(f'🏛️ サーバー: {guild.name}')
            await self.cleanup_and_setup_server(guild)
        
        await self.close()
    
    async def cleanup_and_setup_server(self, guild):
        """サーバーをクリーンアップして、シンプルな構成で再構築"""
        
        print(f"\n🧹 {guild.name} をクリーンアップ中...")
        
        # Step 1: 既存のチャンネル・カテゴリを削除（一般とボイスチャンネル除く）
        await self.cleanup_existing_channels(guild)
        
        # Step 2: シンプルな構成を作成
        await self.create_simple_structure(guild)
        
        # Step 3: ロール設定
        await self.setup_roles(guild)
        
        # Step 4: ウェルカムメッセージ投稿
        await self.post_welcome_message(guild)
        
        print(f"🎉 {guild.name} のクリーンアップ＆セットアップ完了！")
    
    async def cleanup_existing_channels(self, guild):
        """既存のチャンネル・カテゴリを安全に削除"""
        
        # 保持するチャンネル
        keep_channels = ['一般']  # 削除しない基本チャンネル
        
        # カテゴリとチャンネルを削除
        for category in guild.categories:
            if category.name not in ['一般']:  # 基本カテゴリは保持
                print(f"🗑️ カテゴリ削除: {category.name}")
                try:
                    await category.delete()
                    await asyncio.sleep(1)  # レート制限対策
                except Exception as e:
                    print(f"❌ カテゴリ削除失敗: {category.name} - {e}")
        
        # 残ったチャンネルを削除
        for channel in guild.channels:
            if (channel.name not in keep_channels and 
                not isinstance(channel, discord.VoiceChannel) and
                not isinstance(channel, discord.CategoryChannel)):
                print(f"🗑️ チャンネル削除: #{channel.name}")
                try:
                    await channel.delete()
                    await asyncio.sleep(1)  # レート制限対策
                except Exception as e:
                    print(f"❌ チャンネル削除失敗: #{channel.name} - {e}")
        
        print("✅ クリーンアップ完了")
    
    async def create_simple_structure(self, guild):
        """シンプルな9チャンネル構成を作成"""
        
        # カテゴリ作成
        try:
            category = await guild.create_category("AI在宅ワーク研究所")
            print("✅ カテゴリ作成: AI在宅ワーク研究所")
        except Exception as e:
            print(f"❌ カテゴリ作成エラー: {e}")
            return
        
        # チャンネル構成
        channels = [
            # 基本ガイド（運営のみ投稿）
            {"name": "📋-はじめに", "topic": "🏛️ AI在宅ワーク研究所へようこそ！所長からのガイドと研究所のルール"},
            {"name": "📢-所長からのお知らせ", "topic": "🗣️ 重要なお知らせ・週次イベント・研究テーマ更新"},
            {"name": "👋-自己紹介", "topic": "🤝 研究員同士の自己紹介（テンプレ: 職種/得意AI/目標/稼働時間）"},
            
            # 活動の中心
            {"name": "❓-質問・相談", "topic": "🆘 AIツール・副業・技術的な質問はこちら"},
            {"name": "💬-研究員ラウンジ", "topic": "☕ 雑談・近況報告・コワーキング告知・軽い相談"},
            {"name": "🎉-成果報告", "topic": "🏆 AI活用での成功体験・収益実績・目標達成の報告・お祝い"},
            
            # リソース・情報
            {"name": "📰-AI最新情報", "topic": "🔥 最新AIツール・アップデート・業界ニュースをシェア"},
            {"name": "🛠️-テンプレ・リソース", "topic": "📝 プロンプト集・テンプレート・便利ツールまとめ（運営整理）"},
            
            # 有料会員限定（480円プラン）
            {"name": "💎-プレミアム研究室", "topic": "🏆 月額480円会員限定・所長直接サポート・特別コンテンツ"},
        ]
        
        # チャンネル作成
        for channel_info in channels:
            try:
                await guild.create_text_channel(
                    channel_info["name"],
                    category=category,
                    topic=channel_info["topic"]
                )
                print(f"✅ チャンネル作成: #{channel_info['name']}")
                await asyncio.sleep(1.5)  # レート制限対策
            except Exception as e:
                print(f"❌ チャンネル作成エラー: {channel_info['name']} - {e}")
    
    async def setup_roles(self, guild):
        """研究所専用ロール作成"""
        
        roles = [
            {"name": "🏛️ 所長", "color": 0xffd700},
            {"name": "💎 プレミアム研究員", "color": 0xff6b6b},
            {"name": "🔬 研究員", "color": 0x4ecdc4},
            {"name": "👋 新人研究員", "color": 0xffa726},
            {"name": "📊 データ提供者", "color": 0x9c27b0},
            {"name": "🎯 目標達成者", "color": 0x2196f3},
            {"name": "🤝 コラボレーター", "color": 0x8bc34a},
        ]
        
        for role_info in roles:
            existing_role = discord.utils.get(guild.roles, name=role_info["name"])
            if not existing_role:
                try:
                    await guild.create_role(
                        name=role_info["name"],
                        color=role_info["color"]
                    )
                    print(f"✅ ロール作成: {role_info['name']}")
                    await asyncio.sleep(0.5)
                except Exception as e:
                    print(f"❌ ロール作成エラー: {role_info['name']} - {e}")
    
    async def post_welcome_message(self, guild):
        """研究所ガイドをはじめにチャンネルに投稿"""
        
        welcome_channel = discord.utils.get(guild.channels, name="📋-はじめに")
        if welcome_channel:
            embed = discord.Embed(
                title="🏛️ AI在宅ワーク研究所へようこそ！",
                description="月3万円の副収入を「自走」して稼げる研究員を目指すコミュニティ",
                color=0x4ecdc4
            )
            
            embed.add_field(
                name="🔬 研究所のミッション",
                value="""
• **再現性の高いAI活用法の研究**
• **月3万円の副収入達成**
• **研究員同士の知見共有**
• **心理的安全性の確保**
                """,
                inline=False
            )
            
            embed.add_field(
                name="🎯 初回やること（7日間）",
                value="""
1. **👋 自己紹介**: テンプレに沿って投稿
2. **🎯 目標宣言**: 月3万円への具体的な計画
3. **❓ 質問投稿**: 小さな疑問でもOK
4. **🎉 成果報告**: 実験結果（成功・失敗問わず）
                """,
                inline=False
            )
            
            embed.add_field(
                name="💎 プレミアム研究員（月額480円）",
                value="""
• **所長からの直接サポート**
• **限定コンテンツ・ツールアクセス**
• **個別フィードバック・アドバイス**
• **特別な研究プロジェクト参加**
                """,
                inline=False
            )
            
            try:
                await welcome_channel.send(embed=embed)
                print("✅ ウェルカムメッセージ投稿完了")
            except Exception as e:
                print(f"❌ ウェルカムメッセージ投稿エラー: {e}")

async def main():
    """クリーンアップ＆セットアップ実行"""
    bot = CleanupAndSetup()
    
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        print("❌ DISCORD_TOKEN が設定されていません")
        return
    
    try:
        print("🧹 AI在宅ワーク研究所 クリーンアップ＆セットアップ開始...")
        print("=" * 60)
        await bot.start(token)
    except KeyboardInterrupt:
        print("\n🛑 クリーンアップを中断しました")
    except Exception as e:
        print(f"❌ エラー: {e}")
    finally:
        if not bot.is_closed():
            await bot.close()

if __name__ == "__main__":
    asyncio.run(main())