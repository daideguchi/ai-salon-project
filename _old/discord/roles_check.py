#!/usr/bin/env python3
"""
AI在宅ワーク研究所 ロール設定確認
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def check_roles():
    token = os.getenv('DISCORD_TOKEN')
    
    try:
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.members = True
        
        client = discord.Client(intents=intents)
        
        @client.event
        async def on_ready():
            print(f'✅ Logged in as {client.user}')
            
            for guild in client.guilds:
                print(f'\n🏛️ サーバー: {guild.name}')
                
                # ロール一覧表示
                print("\n🎭 ロール一覧:")
                roles = sorted(guild.roles, key=lambda r: r.position, reverse=True)
                for role in roles:
                    if role.name != "@everyone":
                        member_count = len(role.members)
                        color_hex = f"#{role.color:06x}" if role.color.value != 0 else "なし"
                        print(f"  🎯 {role.name}")
                        print(f"     色: {color_hex}, メンバー: {member_count}人")
                        print(f"     権限: {'管理者' if role.permissions.administrator else '一般'}")
                
                # プレミアム研究室の権限確認
                premium_channel = discord.utils.get(guild.channels, name="💎-プレミアム研究室")
                if premium_channel:
                    print(f"\n🔒 プレミアム研究室 (#{premium_channel.name}) 権限設定:")
                    
                    # @everyone デフォルト権限
                    everyone_overwrite = premium_channel.overwrites_for(guild.default_role)
                    print(f"  👥 @everyone:")
                    print(f"     読み取り: {'❌ 禁止' if everyone_overwrite.read_messages is False else '✅ 許可'}")
                    print(f"     送信: {'❌ 禁止' if everyone_overwrite.send_messages is False else '✅ 許可'}")
                    
                    # 各ロールの権限
                    for role, overwrite in premium_channel.overwrites.items():
                        if isinstance(role, discord.Role) and role.name != "@everyone":
                            read_perm = "✅ 許可" if overwrite.read_messages else "❌ 禁止" if overwrite.read_messages is False else "🔄 継承"
                            send_perm = "✅ 許可" if overwrite.send_messages else "❌ 禁止" if overwrite.send_messages is False else "🔄 継承"
                            print(f"  🎯 {role.name}:")
                            print(f"     読み取り: {read_perm}")
                            print(f"     送信: {send_perm}")
                
                # その他制限チャンネルの確認
                restricted_channels = ["📢-所長からのお知らせ", "🛠️-テンプレ・リソース"]
                for channel_name in restricted_channels:
                    channel = discord.utils.get(guild.channels, name=channel_name)
                    if channel:
                        print(f"\n📝 {channel.name} 権限設定:")
                        everyone_overwrite = channel.overwrites_for(guild.default_role)
                        if everyone_overwrite.send_messages is False:
                            print("  👥 @everyone: 読み取りのみ（運営投稿専用）")
                        else:
                            print("  👥 @everyone: 自由投稿可能")
            
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_roles())