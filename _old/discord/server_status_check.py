#!/usr/bin/env python3
"""
AI在宅ワーク研究所 Discord サーバー状態確認
クリーンアップ後の状態とロール設定をチェック
"""

import asyncio
import discord
from discord.ext import commands
from dotenv import load_dotenv
import os

load_dotenv(override=True)

class ServerStatusCheck(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.members = True
        
        super().__init__(
            command_prefix='!status ',
            intents=intents,
            description='AI在宅ワーク研究所 状態確認Bot'
        )
    
    async def on_ready(self):
        print(f'✅ {self.user} でログインしました')
        
        for guild in self.guilds:
            print(f'\n🏛️ サーバー: {guild.name} (ID: {guild.id})')
            await self.check_server_status(guild)
        
        await self.close()
    
    async def check_server_status(self, guild):
        """サーバーの現在状態を詳細チェック"""
        
        print(f"\n📊 === {guild.name} 現在状況 ===")
        print(f"メンバー数: {guild.member_count}")
        
        # カテゴリとチャンネル一覧
        print("\n📁 カテゴリ・チャンネル構成:")
        
        # カテゴリなしのチャンネル
        for channel in guild.channels:
            if channel.category is None and not isinstance(channel, discord.VoiceChannel):
                print(f"  📄 #{channel.name}")
        
        # カテゴリとその配下のチャンネル
        for category in guild.categories:
            print(f"  📂 【{category.name}】")
            for channel in category.channels:
                if isinstance(channel, discord.TextChannel):
                    topic = f" - {channel.topic[:50]}..." if channel.topic else ""
                    print(f"    📝 #{channel.name}{topic}")
                elif isinstance(channel, discord.VoiceChannel):
                    print(f"    🔊 {channel.name}")
        
        # ロール一覧
        print("\n🎭 ロール一覧:")
        roles = sorted(guild.roles, key=lambda r: r.position, reverse=True)
        for role in roles:
            if role.name != "@everyone":
                member_count = len(role.members)
                color = f"#{role.color:06x}" if role.color.value else "なし"
                print(f"  🎯 {role.name} (色: {color}, メンバー: {member_count}人)")
        
        # 権限設定チェック（プレミアム研究室）
        premium_channel = discord.utils.get(guild.channels, name="💎-プレミアム研究室")
        if premium_channel:
            print("\n🔒 プレミアム研究室権限設定:")
            overwrites = premium_channel.overwrites
            for role, perms in overwrites.items():
                if isinstance(role, discord.Role):
                    read_perm = "✅" if perms.read_messages else "❌" 
                    send_perm = "✅" if perms.send_messages else "❌"
                    print(f"    {role.name}: 読取 {read_perm} 送信 {send_perm}")
        
        # 最新の投稿確認
        print("\n📰 最新投稿:")
        for channel in guild.text_channels:
            try:
                messages = [message async for message in channel.history(limit=1)]
                if messages:
                    msg = messages[0]
                    timestamp = msg.created_at.strftime("%m-%d %H:%M")
                    content = msg.content[:30] + "..." if len(msg.content) > 30 else msg.content
                    print(f"  #{channel.name}: [{timestamp}] {msg.author.display_name}: {content}")
                else:
                    print(f"  #{channel.name}: 投稿なし")
            except:
                print(f"  #{channel.name}: 読み取り権限なし")
        
        print(f"\n🎉 {guild.name} の状態確認完了！")
        print("=" * 60)

async def main():
    """サーバー状態確認実行"""
    bot = ServerStatusCheck()
    
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        print("❌ DISCORD_TOKEN が設定されていません")
        return
    
    try:
        print("🔍 AI在宅ワーク研究所 サーバー状態確認開始...")
        print("=" * 60)
        await bot.start(token)
    except KeyboardInterrupt:
        print("\n🛑 状態確認を中断しました")
    except Exception as e:
        print(f"❌ エラー: {e}")
    finally:
        if not bot.is_closed():
            await bot.close()

if __name__ == "__main__":
    asyncio.run(main())