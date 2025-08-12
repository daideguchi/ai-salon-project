#!/usr/bin/env python3
"""環境変数設定確認スクリプト"""

import os
from dotenv import load_dotenv

def check_environment():
    """環境変数の設定状況を確認"""
    
    print("🔍 環境変数設定確認...")
    load_dotenv()
    
    # Discord Token確認
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        print("❌ DISCORD_TOKEN が設定されていません")
        return False
    elif token == 'YOUR_BOT_TOKEN_HERE':
        print("❌ DISCORD_TOKEN がプレースホルダーのままです")
        print("📋 実際のBotトークンに変更してください")
        return False
    else:
        print(f"✅ DISCORD_TOKEN 設定済み (長さ: {len(token)} 文字)")
        
        # Token形式の基本チェック
        if len(token) < 50:
            print("⚠️  トークンが短すぎる可能性があります")
            return False
        
        if not token.count('.') >= 2:
            print("⚠️  トークン形式が正しくない可能性があります")
            return False
            
        print("✅ トークン形式は正常に見えます")
        return True

if __name__ == "__main__":
    success = check_environment()
    
    if success:
        print("\n🎉 環境設定OK - Discord Bot テストを実行できます")
        print("📋 次のステップ: python3 test_discord_connection.py")
    else:
        print("\n❌ 環境設定が必要です")
        print("📋 設定手順: DISCORD_TOKEN_SETUP.md を参照")