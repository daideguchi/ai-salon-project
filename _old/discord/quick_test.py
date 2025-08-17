#!/usr/bin/env python3
"""
Discord 簡単接続テスト
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def quick_test():
    token = os.getenv('DISCORD_TOKEN')
    print(f"Token loaded: {'✅' if token else '❌'}")
    if token:
        print(f"Token first 20 chars: {token[:20]}...")
    
    try:
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        
        client = discord.Client(intents=intents)
        
        @client.event
        async def on_ready():
            print(f'✅ Logged in as {client.user}')
            print(f'Servers: {len(client.guilds)}')
            
            for guild in client.guilds:
                print(f'  🏛️ {guild.name} - {len(guild.channels)} channels, {guild.member_count} members')
                
                # 簡単なチャンネル一覧
                categories = {}
                for channel in guild.channels:
                    if isinstance(channel, discord.TextChannel):
                        cat_name = channel.category.name if channel.category else "No Category"
                        if cat_name not in categories:
                            categories[cat_name] = []
                        categories[cat_name].append(channel.name)
                
                for cat_name, channels in categories.items():
                    print(f'    📁 {cat_name}: {", ".join(channels)}')
            
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(quick_test())