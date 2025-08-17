#!/usr/bin/env python3
"""
AI在宅ワーク研究所 Discord 最終動作テスト
全チャンネル・権限・機能の総合確認
"""

import discord
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(override=True)

async def final_test():
    token = os.getenv('DISCORD_TOKEN')
    
    try:
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        
        client = discord.Client(intents=intents)
        
        @client.event
        async def on_ready():
            print(f'🎉 AI在宅ワーク研究所 Discord 最終動作テスト')
            print("=" * 60)
            print(f'✅ ボット接続: {client.user}')
            
            guild = client.guilds[0]
            print(f'🏛️ サーバー: {guild.name} (メンバー: {guild.member_count}名)')
            
            # ===== 1. チャンネル構成テスト =====
            print(f"\n📁 1. チャンネル構成テスト:")
            
            expected_channels = [
                "📋-はじめに",
                "📢-所長からのお知らせ", 
                "👋-自己紹介",
                "❓-質問・相談",
                "💬-研究員ラウンジ",
                "🎉-成果報告",
                "📰-ai最新情報",
                "🛠️-テンプレ・リソース",
                "💎-プレミアム研究室"
            ]
            
            research_category = discord.utils.get(guild.categories, name="AI在宅ワーク研究所")
            if research_category:
                print(f"  ✅ カテゴリ「AI在宅ワーク研究所」存在確認")
                
                found_channels = []
                for channel in research_category.channels:
                    if isinstance(channel, discord.TextChannel):
                        found_channels.append(channel.name)
                        print(f"    📝 #{channel.name} - {channel.topic[:50] if channel.topic else ''}...")
                
                missing = set(expected_channels) - set(found_channels)
                if missing:
                    print(f"  ❌ 不足チャンネル: {missing}")
                else:
                    print(f"  ✅ 全9チャンネル正常に存在")
            else:
                print(f"  ❌ カテゴリ「AI在宅ワーク研究所」が見つかりません")
            
            # ===== 2. ロール構成テスト =====
            print(f"\n🎭 2. ロール構成テスト:")
            
            expected_roles = [
                "🏛️ 所長",
                "💎 プレミアム研究員",
                "🔬 研究員", 
                "👋 新人研究員",
                "📊 データ提供者",
                "🎯 目標達成者",
                "🤝 コラボレーター"
            ]
            
            found_roles = []
            for role in guild.roles:
                if role.name in expected_roles:
                    found_roles.append(role.name)
                    color_hex = f"#{role.color:06x}" if role.color.value != 0 else "デフォルト"
                    print(f"  🎯 {role.name} (色: {color_hex})")
            
            missing_roles = set(expected_roles) - set(found_roles)
            if missing_roles:
                print(f"  ❌ 不足ロール: {missing_roles}")
            else:
                print(f"  ✅ 全7ロール正常に存在")
            
            # ===== 3. プレミアム研究室権限テスト =====
            print(f"\n🔒 3. プレミアム研究室権限テスト:")
            
            premium_channel = discord.utils.get(guild.channels, name="💎-プレミアム研究室")
            if premium_channel:
                everyone_perms = premium_channel.overwrites_for(guild.default_role)
                premium_role = discord.utils.get(guild.roles, name="💎 プレミアム研究員")
                director_role = discord.utils.get(guild.roles, name="🏛️ 所長")
                
                # @everyone 制限確認
                if everyone_perms.view_channel is False:
                    print(f"  ✅ @everyone のアクセス制限: 正常")
                else:
                    print(f"  ❌ @everyone のアクセス制限: 失敗")
                
                # プレミアム会員権限確認
                if premium_role:
                    premium_perms = premium_channel.overwrites_for(premium_role)
                    if premium_perms.view_channel and premium_perms.send_messages:
                        print(f"  ✅ プレミアム研究員権限: 正常")
                    else:
                        print(f"  ❌ プレミアム研究員権限: 設定不足")
                
                # 所長権限確認
                if director_role:
                    director_perms = premium_channel.overwrites_for(director_role)
                    if director_perms.view_channel and director_perms.manage_messages:
                        print(f"  ✅ 所長管理権限: 正常")
                    else:
                        print(f"  ❌ 所長管理権限: 設定不足")
            else:
                print(f"  ❌ プレミアム研究室チャンネルが見つかりません")
            
            # ===== 4. ウェルカムメッセージテスト =====
            print(f"\n📰 4. ウェルカムメッセージテスト:")
            
            begin_channel = discord.utils.get(guild.channels, name="📋-はじめに")
            if begin_channel:
                try:
                    messages = [msg async for msg in begin_channel.history(limit=5)]
                    if messages:
                        bot_messages = [msg for msg in messages if msg.author.bot]
                        if bot_messages:
                            latest_bot_msg = bot_messages[0]
                            print(f"  ✅ ウェルカムメッセージ存在")
                            print(f"    投稿日時: {latest_bot_msg.created_at.strftime('%Y-%m-%d %H:%M')}")
                            if latest_bot_msg.embeds:
                                print(f"    Embedタイトル: {latest_bot_msg.embeds[0].title}")
                        else:
                            print(f"  ⚠️  ボットメッセージが見つかりません")
                    else:
                        print(f"  ❌ メッセージが存在しません")
                except:
                    print(f"  ❌ メッセージ読み取りエラー")
            
            # プレミアム研究室ウェルカムメッセージ
            if premium_channel:
                try:
                    premium_messages = [msg async for msg in premium_channel.history(limit=2)]
                    if premium_messages:
                        bot_premium_msgs = [msg for msg in premium_messages if msg.author.bot]
                        if bot_premium_msgs:
                            print(f"  ✅ プレミアム研究室ウェルカムメッセージ存在")
                        else:
                            print(f"  ⚠️  プレミアム研究室ボットメッセージなし")
                except:
                    print(f"  ❌ プレミアム研究室メッセージ読み取りエラー")
            
            # ===== 5. 総合評価 =====
            print(f"\n🎯 5. 総合評価:")
            
            # チェック項目
            checks = {
                "チャンネル構成": research_category and len(research_category.channels) >= 9,
                "ロール設定": len(found_roles) >= 7,
                "プレミアム制限": premium_channel and everyone_perms.view_channel is False,
                "ウェルカムメッセージ": begin_channel and len([msg async for msg in begin_channel.history(limit=1)]) > 0
            }
            
            passed = sum(checks.values())
            total = len(checks)
            
            print(f"  📊 合格スコア: {passed}/{total} ({passed/total*100:.1f}%)")
            
            for check_name, result in checks.items():
                status = "✅ 合格" if result else "❌ 不合格"
                print(f"    {check_name}: {status}")
            
            if passed == total:
                print(f"\n🎉 AI在宅ワーク研究所 Discord サーバー構築完了！")
                print(f"💰 480円月額プランの運用準備が整いました")
                print(f"🚀 サロン開始可能状態です")
            else:
                print(f"\n⚠️  いくつかの項目で問題が検出されました")
                print(f"🔧 修正後に再テストを実行してください")
            
            print("=" * 60)
            await client.close()
        
        await client.start(token)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(final_test())