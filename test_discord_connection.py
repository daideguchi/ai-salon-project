#!/usr/bin/env python3
"""
Discord Bot接続テストスクリプト
動作確認用 - 実際にDiscordに接続してトークンの有効性を確認
"""

import os
import asyncio
import discord
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

async def test_discord_connection():
    """Discord Botの接続テスト"""
    
    print("🔍 Discord Bot接続テスト開始...")
    
    # 1. 環境変数確認
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        print("❌ DISCORD_TOKEN が .env ファイルに設定されていません")
        print("📋 設定方法: DISCORD_TOKEN_SETUP.md を参照してください")
        return False
    
    if len(token) < 50:
        print("❌ DISCORD_TOKEN の形式が正しくない可能性があります")
        print(f"現在の長さ: {len(token)} 文字")
        print("正しい形式: MTxxxx.xxxxx.xxxxxxxxxxxxxxxxxxxxxxxx (70文字程度)")
        return False
    
    print(f"✅ DISCORD_TOKEN 読み込み成功 (長さ: {len(token)} 文字)")
    
    # 2. Discord接続テスト
    try:
        # 最小限のBotクライアント作成
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        
        class TestBot(discord.Client):
            def __init__(self):
                super().__init__(intents=intents)
                self.connection_success = False
            
            async def on_ready(self):
                print(f"✅ Discord接続成功!")
                print(f"📋 Bot名: {self.user.name}")
                print(f"🆔 Bot ID: {self.user.id}")
                print(f"📱 参加サーバー数: {len(self.guilds)}")
                
                if self.guilds:
                    print("📋 参加中のサーバー:")
                    for guild in self.guilds:
                        print(f"  - {guild.name} (ID: {guild.id})")
                else:
                    print("⚠️  まだどのサーバーにも参加していません")
                    print("📋 Botをサーバーに招待してください:")
                    print("    DISCORD_TOKEN_SETUP.md の OAuth2 設定を参照")
                
                self.connection_success = True
                await self.close()
            
            async def on_error(self, event, *args, **kwargs):
                print(f"❌ Discord エラー: {event}")
                await self.close()
        
        # 接続テスト実行
        print("🔄 Discord に接続中...")
        bot = TestBot()
        
        try:
            await bot.start(token)
            return bot.connection_success
        except discord.LoginFailure:
            print("❌ Discord ログイン失敗")
            print("原因:")
            print("  1. トークンが無効または期限切れ")
            print("  2. Developer Portal でトークンが再生成された")
            print("📋 解決方法: 新しいトークンを取得して .env を更新")
            return False
        except discord.HTTPException as e:
            print(f"❌ Discord HTTP エラー: {e}")
            return False
        except Exception as e:
            print(f"❌ 予期しないエラー: {e}")
            return False
            
    except KeyboardInterrupt:
        print("\n🛑 テストを中断しました")
        return False

async def main():
    """メイン関数"""
    print("=" * 50)
    print("🤖 AI副業サロン Discord Bot 接続テスト")
    print("=" * 50)
    
    success = await test_discord_connection()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 テスト完了: Discord Bot は正常に動作します!")
        print("✅ 次のステップ: python3 discord/salon_channel_setup.py")
    else:
        print("❌ テスト失敗: Discord Bot の設定を確認してください")
        print("📋 設定手順: DISCORD_TOKEN_SETUP.md を参照")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main())