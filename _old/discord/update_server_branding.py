#!/usr/bin/env python3
"""
AI在宅ワーク研究所 Discord サーバー名・説明文・設定更新
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def update_server_branding():
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
            print(f'🏛️ 現在のサーバー名: {guild.name}')
            
            try:
                # サーバー名を変更
                await guild.edit(
                    name="AI在宅ワーク研究所",
                    description="月3万円の副収入を『自走』して稼げる研究員を育成するコミュニティ",
                    reason="正式名称への変更"
                )
                print("✅ サーバー名を「AI在宅ワーク研究所」に変更しました")
                
                # システムメッセージチャンネルの設定（はじめにチャンネル）
                begin_channel = discord.utils.get(guild.channels, name="📋-はじめに")
                if begin_channel:
                    await guild.edit(
                        system_channel=begin_channel,
                        reason="はじめにチャンネルをシステムチャンネルに設定"
                    )
                    print("✅ システムチャンネルを #📋-はじめに に設定しました")
                
                # ウェルカムスクリーンの設定（Discord APIの制限により手動設定推奨）
                print("\n📋 次の設定は手動で行ってください:")
                print("1. サーバー設定 → 概要 → ウェルカムスクリーン を有効化")
                print("2. 説明文: 🔬 AI活用で月3万円の副収入を目指す研究コミュニティ")
                print("3. 推奨チャンネル: #📋-はじめに、#👋-自己紹介、#❓-質問・相談")
                
                # 発見可能性の設定（手動推奨）
                print("\n🌐 発見可能性の設定:")
                print("1. サーバー設定 → 発見可能性 → 公開サーバーに設定")
                print("2. カテゴリ: Education（教育）")
                print("3. タグ: AI, 副業, 在宅ワーク, ChatGPT, 初心者歓迎")
                
                # コミュニティ機能の有効化
                features = guild.features
                print(f"\n🎪 現在のサーバー機能: {features}")
                print("💡 コミュニティ機能が有効でない場合は、サーバー設定で有効化してください")
                
                # 認証レベルの確認
                verification_level = guild.verification_level
                print(f"\n🔒 現在の認証レベル: {verification_level}")
                if verification_level != discord.VerificationLevel.low:
                    print("💡 初心者向けコミュニティのため、認証レベルを「低」に設定することを推奨")
                
                # サーバーブースト状況
                print(f"\n🚀 ブーストレベル: {guild.premium_tier}")
                print(f"💎 ブースト数: {guild.premium_subscription_count}")
                
                print("\n🎉 サーバーブランディング更新完了！")
                print("手動設定項目については、Discord の「サーバー設定」から設定してください。")
                
            except discord.Forbidden:
                print("❌ サーバー編集権限がありません。ボットに管理者権限を付与してください。")
            except Exception as e:
                print(f"❌ サーバー更新エラー: {e}")
            
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ エラー: {e}")

if __name__ == "__main__":
    asyncio.run(update_server_branding())