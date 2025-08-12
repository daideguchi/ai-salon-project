#!/usr/bin/env python3
"""強制的にローカル.envファイルを読み込んでテスト"""

import os
from dotenv import load_dotenv

def test_env_loading():
    """ローカル.envファイルの強制読み込みテスト"""
    
    print("🔍 環境変数読み込みテスト...")
    
    # 現在の作業ディレクトリ確認
    print(f"📁 現在のディレクトリ: {os.getcwd()}")
    
    # .envファイルの存在確認
    env_file = ".env"
    if os.path.exists(env_file):
        print(f"✅ {env_file} ファイル存在確認")
        
        # ファイル内容確認
        with open(env_file, 'r') as f:
            lines = f.readlines()
            for i, line in enumerate(lines, 1):
                if 'DISCORD_TOKEN' in line and not line.strip().startswith('#'):
                    print(f"📋 {env_file}:{i}: {line.strip()}")
                    break
    else:
        print(f"❌ {env_file} ファイルが見つかりません")
        return False
    
    # 既存環境変数確認
    existing = os.environ.get('DISCORD_TOKEN')
    if existing:
        print(f"⚠️  既存環境変数: {existing[:20]}...")
    else:
        print("✅ 既存環境変数なし")
    
    # override=Trueで強制上書き
    print("🔄 dotenv読み込み (override=True)...")
    load_dotenv(override=True)
    
    # 読み込み後確認
    token = os.getenv('DISCORD_TOKEN')
    if token:
        print(f"✅ DISCORD_TOKEN 読み込み成功")
        print(f"📏 長さ: {len(token)} 文字")
        print(f"🔤 先頭30文字: {token[:30]}...")
        
        if len(token) > 50 and '.' in token:
            print("✅ 正常なDiscord Tokenフォーマット")
            return True
        else:
            print("❌ Token形式が正しくない")
            return False
    else:
        print("❌ DISCORD_TOKEN 読み込み失敗")
        return False

if __name__ == "__main__":
    success = test_env_loading()
    if success:
        print("\n🎉 環境変数読み込み成功！")
    else:
        print("\n❌ 環境変数読み込み失敗")