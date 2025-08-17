#!/usr/bin/env python3
"""
Discord 基本動作テスト - メッセージ投稿と基本情報取得
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def basic_test():
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
            
            # ロール基本情報
            print("\n🎭 ロール:")
            for role in guild.roles:
                if role.name != "@everyone":
                    print(f"  - {role.name}")
            
            # チャンネル基本情報  
            print("\n📁 チャンネル:")
            for channel in guild.text_channels:
                category = channel.category.name if channel.category else "なし"
                print(f"  - #{channel.name} ({category})")
            
            # テストメッセージ投稿（はじめにチャンネル）
            begin_channel = discord.utils.get(guild.channels, name="📋-はじめに")
            if begin_channel:
                try:
                    # 最新メッセージ確認
                    messages = [msg async for msg in begin_channel.history(limit=1)]
                    if messages:
                        latest_msg = messages[0]
                        print(f"\n📰 はじめにチャンネル最新投稿:")
                        print(f"  投稿者: {latest_msg.author.display_name}")
                        print(f"  内容: {latest_msg.content[:100]}...")
                        print(f"  時間: {latest_msg.created_at.strftime('%Y-%m-%d %H:%M')}")
                    else:
                        print("\n📰 はじめにチャンネルに投稿なし")
                except Exception as e:
                    print(f"❌ はじめにチャンネル読み取りエラー: {e}")
            
            print(f"\n✅ 基本動作テスト完了")
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ 接続エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(basic_test())