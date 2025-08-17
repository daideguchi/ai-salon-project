#!/usr/bin/env python3
"""
クイックアップロード - Google Apps Script WebApp URL設定後に実行
"""

import requests
import json
import csv
import os
import time

def upload_to_sheets(webapp_url):
    """
    WebApp URLを受け取って全データをアップロード
    """
    
    # CSVファイルマッピング
    csv_mappings = [
        {
            'sheet_type': 'salon_basic',
            'file': 'spreadsheet_data/salon_basic_enhancement.csv',
            'description': 'サロン基本設計拡張データ'
        },
        {
            'sheet_type': 'free_benefits', 
            'file': 'spreadsheet_data/free_benefits_enhancement.csv',
            'description': '無料特典設計拡張データ'
        },
        {
            'sheet_type': 'premium_content',
            'file': 'spreadsheet_data/premium_content_enhancement.csv', 
            'description': '有料コンテンツ拡張データ'
        },
        {
            'sheet_type': 'research_log',
            'file': 'spreadsheet_data/research_log_final.csv',
            'description': '研究開発ログ統合データ'
        }
    ]
    
    print(f"🚀 AI副業サロン - スプレッドシート一括アップロード開始")
    print(f"📡 WebApp URL: {webapp_url}")
    
    # 接続テスト
    try:
        print("\n🔗 接続テスト中...")
        response = requests.get(webapp_url, timeout=10)
        test_result = response.json()
        print(f"✅ 接続成功: {test_result.get('status', 'OK')}")
    except Exception as e:
        print(f"❌ 接続失敗: {e}")
        return False
    
    # 各シートにデータアップロード
    total_success = 0
    total_failed = 0
    
    for mapping in csv_mappings:
        sheet_type = mapping['sheet_type']
        csv_file = mapping['file']
        description = mapping['description']
        
        print(f"\n📊 {description} アップロード中...")
        
        if not os.path.exists(csv_file):
            print(f"⚠️ ファイルが見つかりません: {csv_file}")
            continue
        
        success_count = 0
        failed_count = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                csv_reader = csv.reader(file)
                
                for row_num, row in enumerate(csv_reader, 1):
                    if not row or all(cell.strip() == '' for cell in row):
                        continue  # 空行をスキップ
                    
                    # POSTリクエスト送信
                    payload = {
                        'sheet_type': sheet_type,
                        'data': row
                    }
                    
                    try:
                        response = requests.post(
                            webapp_url,
                            data=json.dumps(payload),
                            headers={'Content-Type': 'application/json'},
                            timeout=30
                        )
                        
                        result = response.json()
                        
                        if result.get('result') == 'success':
                            success_count += 1
                            print(f"  ✅ Row {row_num}: {row[0][:30]}...")
                        else:
                            failed_count += 1
                            print(f"  ❌ Row {row_num}: {result.get('error', 'Unknown error')}")
                            
                    except Exception as e:
                        failed_count += 1
                        print(f"  ❌ Row {row_num}: Request failed - {e}")
                    
                    # APIレート制限対策
                    time.sleep(0.5)
                        
        except Exception as e:
            print(f"❌ CSVファイル読み込み失敗: {e}")
            continue
        
        print(f"📋 {sheet_type} 結果: ✅{success_count} / ❌{failed_count}")
        total_success += success_count
        total_failed += failed_count
    
    print(f"\n🎯 全体結果:")
    print(f"  ✅ 成功: {total_success} 行")
    print(f"  ❌ 失敗: {total_failed} 行")
    print(f"  📊 成功率: {(total_success/(total_success+total_failed)*100):.1f}%" if (total_success+total_failed) > 0 else "0%")
    
    return total_success > 0

def main():
    print("🔥 AI副業サロン - Google Sheets直接書き込みシステム")
    print("=" * 60)
    
    print("\n📋 準備確認:")
    print("  1. Google Apps Scriptプロジェクト作成済み ✓")
    print("  2. WebAppとしてデプロイ済み ✓") 
    print("  3. WebアプリURL取得済み ✓")
    
    webapp_url = input("\n🔗 WebアプリURLを入力してください: ").strip()
    
    if not webapp_url:
        print("❌ URLが入力されていません。")
        return
    
    if not webapp_url.startswith('https://script.google.com'):
        print("⚠️ 正しいGoogle Apps Script URLか確認してください。")
        proceed = input("続行しますか？ (y/N): ")
        if proceed.lower() != 'y':
            return
    
    print(f"\n🚀 アップロード開始...")
    success = upload_to_sheets(webapp_url)
    
    if success:
        print("\n🎉 スプレッドシート更新完了！")
        print("📊 Google Sheetsを確認してください:")
        print("  - サロン基本設計: https://docs.google.com/spreadsheets/d/1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g/")
        print("  - 無料特典設計: https://docs.google.com/spreadsheets/d/1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs/") 
        print("  - 有料コンテンツ: https://docs.google.com/spreadsheets/d/1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ/")
        print("  - 研究開発ログ: https://docs.google.com/spreadsheets/d/1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI/")
    else:
        print("\n❌ アップロードに失敗しました。URLとスクリプトを確認してください。")

if __name__ == "__main__":
    main()