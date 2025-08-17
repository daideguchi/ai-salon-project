#!/usr/bin/env python3
"""
AI在宅ワーク研究所 プレミアム研究室権限修正
480円会員限定アクセス制御を正しく設定
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def fix_premium_permissions():
    token = os.getenv('DISCORD_TOKEN')
    
    try:
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        
        client = discord.Client(intents=intents)
        
        @client.event
        async def on_ready():
            print(f'✅ ボット接続: {client.user}')
            
            guild = client.guilds[0]
            print(f'🏛️ サーバー: {guild.name}')
            
            # プレミアム研究室チャンネル取得
            premium_channel = discord.utils.get(guild.channels, name="💎-プレミアム研究室")
            if not premium_channel:
                print("❌ プレミアム研究室チャンネルが見つかりません")
                await client.close()
                return
            
            print(f"\n🔧 プレミアム研究室権限修正開始...")
            print(f"チャンネル: #{premium_channel.name}")
            
            # 必要なロール取得
            everyone_role = guild.default_role
            premium_role = discord.utils.get(guild.roles, name="💎 プレミアム研究員")
            director_role = discord.utils.get(guild.roles, name="🏛️ 所長")
            
            if not premium_role:
                print("❌ プレミアム研究員ロールが見つかりません")
                await client.close()
                return
            
            if not director_role:
                print("❌ 所長ロールが見つかりません")
                await client.close()
                return
            
            try:
                # 1. @everyone の権限を制限（チャンネル表示禁止）
                await premium_channel.set_permissions(
                    everyone_role,
                    view_channel=False,
                    read_messages=False,
                    send_messages=False,
                    reason="480円会員限定チャンネルのためアクセス制限"
                )
                print("✅ @everyone のアクセスを禁止しました")
                
                # 2. プレミアム研究員の権限を許可
                await premium_channel.set_permissions(
                    premium_role,
                    view_channel=True,
                    read_messages=True,
                    send_messages=True,
                    reason="プレミアム研究員のアクセス許可"
                )
                print("✅ 💎 プレミアム研究員のアクセスを許可しました")
                
                # 3. 所長の権限を許可（管理権限付き）
                await premium_channel.set_permissions(
                    director_role,
                    view_channel=True,
                    read_messages=True,
                    send_messages=True,
                    manage_messages=True,
                    manage_permissions=True,
                    reason="所長の管理権限"
                )
                print("✅ 🏛️ 所長の管理権限を設定しました")
                
                # 権限設定確認
                print(f"\n🔍 設定後の権限確認:")
                
                everyone_perms = premium_channel.overwrites_for(everyone_role)
                premium_perms = premium_channel.overwrites_for(premium_role)
                director_perms = premium_channel.overwrites_for(director_role)
                
                print(f"\n👥 @everyone:")
                print(f"  📖 チャンネル表示: {'❌ 禁止' if everyone_perms.view_channel is False else '✅ 許可'}")
                print(f"  📝 メッセージ読み取り: {'❌ 禁止' if everyone_perms.read_messages is False else '✅ 許可'}")
                print(f"  ✍️ メッセージ送信: {'❌ 禁止' if everyone_perms.send_messages is False else '✅ 許可'}")
                
                print(f"\n💎 プレミアム研究員:")
                print(f"  📖 チャンネル表示: {'✅ 許可' if premium_perms.view_channel else '❌ 禁止'}")
                print(f"  📝 メッセージ読み取り: {'✅ 許可' if premium_perms.read_messages else '❌ 禁止'}")
                print(f"  ✍️ メッセージ送信: {'✅ 許可' if premium_perms.send_messages else '❌ 禁止'}")
                
                print(f"\n🏛️ 所長:")
                print(f"  📖 チャンネル表示: {'✅ 許可' if director_perms.view_channel else '❌ 禁止'}")
                print(f"  📝 メッセージ読み取り: {'✅ 許可' if director_perms.read_messages else '❌ 禁止'}")
                print(f"  ✍️ メッセージ送信: {'✅ 許可' if director_perms.send_messages else '❌ 禁止'}")
                print(f"  🛠️ メッセージ管理: {'✅ 許可' if director_perms.manage_messages else '❌ 禁止'}")
                
                # 初回ウェルカムメッセージ投稿
                embed = discord.Embed(
                    title="💎 プレミアム研究室へようこそ！",
                    description="月額480円の特別エリア - 所長直接サポートと限定コンテンツ",
                    color=0xff6b6b
                )
                
                embed.add_field(
                    name="🏆 プレミアム特典",
                    value="""
• **所長からの個別フィードバック**
• **限定AI活用テンプレート**
• **週次グループコンサル参加権**
• **成果達成者事例の詳細共有**
• **新ツール・手法の先行公開**
                    """,
                    inline=False
                )
                
                embed.add_field(
                    name="🎯 ご利用方法",
                    value="""
1. **目標・進捗を定期報告**
2. **具体的な質問・相談を投稿**
3. **他の研究員との情報交換**
4. **所長からのフィードバックを実践**
                    """,
                    inline=False
                )
                
                embed.set_footer(text="🔒 このチャンネルはプレミアム研究員限定です")
                
                await premium_channel.send(embed=embed)
                print("✅ プレミアム研究室ウェルカムメッセージを投稿しました")
                
                print(f"\n🎉 プレミアム研究室の権限修正が完了しました！")
                print("💰 480円会員限定チャンネルとして正しく設定されています")
                
            except discord.Forbidden:
                print("❌ 権限不足: ボットに管理者権限が必要です")
            except Exception as e:
                print(f"❌ 権限設定エラー: {e}")
                import traceback
                traceback.print_exc()
            
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(fix_premium_permissions())