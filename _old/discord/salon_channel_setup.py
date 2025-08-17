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

load_dotenv(override=True)

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
        
        # 🎯 AI在宅ワーク研究所 - シンプル構成（初心者向け最適化）
        salon_structure = {
            # メインチャンネル（フラット構造）
            "AI在宅ワーク研究所": {
                "type": "category",
                "channels": [
                    # 基本ガイド（運営のみ投稿）
                    {"name": "📋-はじめに", "topic": "🏛️ AI在宅ワーク研究所へようこそ！所長からのガイドと研究所のルール"},
                    {"name": "📢-所長からのお知らせ", "topic": "🗣️ 重要なお知らせ・週次イベント・研究テーマ更新"},
                    {"name": "👋-自己紹介", "topic": "🤝 研究員同士の自己紹介（テンプレ: 職種/得意AI/目標/稼働時間）"},
                    
                    # 活動の中心
                    {"name": "❓-質問・相談", "topic": "🆘 AIツール・副業・技術的な質問はこちら（Forum形式）", "type": "forum"},
                    {"name": "💬-研究員ラウンジ", "topic": "☕ 雑談・近況報告・コワーキング告知・軽い相談"},
                    {"name": "🎉-成果報告", "topic": "🏆 AI活用での成功体験・収益実績・目標達成の報告・お祝い"},
                    
                    # リソース・情報
                    {"name": "📰-AI最新情報", "topic": "🔥 最新AIツール・アップデート・業界ニュースをシェア"},
                    {"name": "🛠️-テンプレ・リソース", "topic": "📝 プロンプト集・テンプレート・便利ツールまとめ（運営整理）"},
                    
                    # 有料会員限定（480円プラン）
                    {"name": "💎-プレミアム研究室", "topic": "🏆 月額480円会員限定・所長直接サポート・特別コンテンツ"},
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
        """AI在宅ワーク研究所 専用ロール作成"""
        
        salon_roles = [
            # 基本ロール
            {"name": "🏛️ 所長", "color": 0xffd700, "permissions": discord.Permissions(administrator=True)},
            {"name": "💎 プレミアム研究員", "color": 0xff6b6b, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🔬 研究員", "color": 0x4ecdc4, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "👋 新人研究員", "color": 0xffa726, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            
            # 活動ベース称号（自動付与）
            {"name": "📊 データ提供者", "color": 0x9c27b0, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🎯 目標達成者", "color": 0x2196f3, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
            {"name": "🤝 コラボレーター", "color": 0x8bc34a, "permissions": discord.Permissions(read_messages=True, send_messages=True)},
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
        """AI在宅ワーク研究所 ガイドを投稿"""
        
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
                name="📊 研究分野（例）",
                value="""
• **🎬 AI動画生成**: YouTube収益化
• **📝 コンテンツ自動化**: ブログ・記事作成
• **📚 出版**: Kindle・電子書籍
• **🛠️ ツール開発**: 効率化・自動化
                """,
                inline=False
            )
            
            embed.add_field(
                name="🎯 初回やること（7日間）",
                value="""
1. **👋 自己紹介**: テンプレに沿って投稿
2. **🎯 目標宣言**: 月3万円への具体的な計画
3. **❓ 質問投稿**: 小さな疑問でもOK
4. **📊 データ共有**: 実験結果（成功・失敗問わず）
                """,
                inline=False
            )
            
            embed.add_field(
                name="🏛️ 研究員ロール",
                value="""
• **🏛️ 所長**: 研究テーマ提示・サポート
• **💎 プレミアム研究員**: 月額480円・特別サポート
• **🔬 研究員**: 基本メンバー
• **📊 データ提供者**: 実験結果共有で自動付与
                """,
                inline=False
            )
            
            embed.add_field(
                name="💡 研究所の約束",
                value="""
• **失敗も歓迎**: 失敗データも貴重な研究成果
• **初心者ファースト**: 専門用語は分かりやすく
• **互いに尊重**: 批判ではなく建設的なフィードバック
• **実践重視**: 理論より実際の収益化を目指す
                """,
                inline=False
            )
            
            try:
                await welcome_channel.send(embed=embed)
                print("✅ 研究所ガイド投稿完了")
            except Exception as e:
                print(f"❌ 研究所ガイド投稿エラー: {e}")

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