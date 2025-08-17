#!/usr/bin/env python3
"""
AI在宅ワーク研究所 プレミアム研究室権限テスト
480円会員限定チャンネルのアクセス制御を確認
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def test_premium_permissions():
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
            
            print(f"\n🔒 プレミアム研究室権限テスト:")
            print(f"チャンネル: #{premium_channel.name}")
            
            # 権限設定の詳細確認
            overwrites = premium_channel.overwrites
            print(f"\n📋 現在の権限設定 ({len(overwrites)}個):")
            
            # @everyone のデフォルト権限
            everyone_role = guild.default_role
            everyone_perms = premium_channel.overwrites_for(everyone_role)
            
            print(f"\n👥 @everyone (一般メンバー):")
            print(f"  📖 チャンネル表示: {'❌ 禁止' if everyone_perms.view_channel is False else '✅ 許可' if everyone_perms.view_channel else '🔄 継承'}")
            print(f"  📝 メッセージ読み取り: {'❌ 禁止' if everyone_perms.read_messages is False else '✅ 許可' if everyone_perms.read_messages else '🔄 継承'}")
            print(f"  ✍️ メッセージ送信: {'❌ 禁止' if everyone_perms.send_messages is False else '✅ 許可' if everyone_perms.send_messages else '🔄 継承'}")
            
            # プレミアムロール権限
            premium_role = discord.utils.get(guild.roles, name="💎 プレミアム研究員")
            if premium_role:
                premium_perms = premium_channel.overwrites_for(premium_role)
                print(f"\n💎 プレミアム研究員:")
                print(f"  📖 チャンネル表示: {'✅ 許可' if premium_perms.view_channel else '❌ 禁止' if premium_perms.view_channel is False else '🔄 継承'}")
                print(f"  📝 メッセージ読み取り: {'✅ 許可' if premium_perms.read_messages else '❌ 禁止' if premium_perms.read_messages is False else '🔄 継承'}")
                print(f"  ✍️ メッセージ送信: {'✅ 許可' if premium_perms.send_messages else '❌ 禁止' if premium_perms.send_messages is False else '🔄 継承'}")
            else:
                print(f"\n💎 プレミアム研究員ロールが見つかりません")
            
            # 所長権限
            director_role = discord.utils.get(guild.roles, name="🏛️ 所長")
            if director_role:
                director_perms = premium_channel.overwrites_for(director_role)
                print(f"\n🏛️ 所長:")
                print(f"  📖 チャンネル表示: {'✅ 許可' if director_perms.view_channel else '❌ 禁止' if director_perms.view_channel is False else '🔄 継承'}")
                print(f"  📝 メッセージ読み取り: {'✅ 許可' if director_perms.read_messages else '❌ 禁止' if director_perms.read_messages is False else '🔄 継承'}")
                print(f"  ✍️ メッセージ送信: {'✅ 許可' if director_perms.send_messages else '❌ 禁止' if director_perms.send_messages is False else '🔄 継承'}")
            else:
                print(f"\n🏛️ 所長ロールが見つかりません")
            
            # チャンネルの基本情報
            print(f"\n📊 チャンネル基本情報:")
            print(f"  📝 チャンネルトピック: {premium_channel.topic}")
            print(f"  🔢 チャンネルID: {premium_channel.id}")
            print(f"  📁 カテゴリ: {premium_channel.category.name if premium_channel.category else 'なし'}")
            
            # 最新メッセージ確認
            try:
                messages = [msg async for msg in premium_channel.history(limit=1)]
                if messages:
                    latest_msg = messages[0]
                    print(f"\n📰 最新メッセージ:")
                    print(f"  👤 投稿者: {latest_msg.author.display_name}")
                    print(f"  📝 内容: {latest_msg.content[:100]}...")
                    print(f"  🕐 時間: {latest_msg.created_at.strftime('%Y-%m-%d %H:%M')}")
                else:
                    print(f"\n📰 メッセージなし")
            except discord.Forbidden:
                print(f"\n🔒 読み取り権限なし（正常な制限）")
            except Exception as e:
                print(f"\n❌ メッセージ読み取りエラー: {e}")
            
            # 権限設定の推奨事項
            print(f"\n🎯 権限設定推奨事項:")
            
            if everyone_perms.view_channel is not False:
                print("  ⚠️  @everyone のチャンネル表示を禁止に設定することを推奨")
            else:
                print("  ✅ @everyone のチャンネル表示が正しく禁止されています")
            
            if premium_role and premium_perms.view_channel is not True:
                print("  ⚠️  プレミアム研究員の表示権限を許可に設定することを推奨")
            elif premium_role:
                print("  ✅ プレミアム研究員の権限が正しく設定されています")
            
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_premium_permissions())