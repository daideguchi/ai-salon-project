#!/usr/bin/env python3
"""
🤖 AI副業サロン - スプレッドシート書き込みシステム
シンプル版 - 1ファイル完結
"""

import requests
import json
import csv
import os
from datetime import datetime

class SalonSheetsWriter:
    def __init__(self):
        # 4つのスプレッドシート設定
        self.sheets = {
            'salon_basic': {
                'id': '1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g',
                'name': 'サロン基本設計',
                'file': 'spreadsheet_data/salon_basic_enhancement.csv'
            },
            'free_benefits': {
                'id': '1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs',
                'name': '無料特典設計',
                'file': 'spreadsheet_data/free_benefits_enhancement.csv'
            },
            'premium_content': {
                'id': '1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ',
                'name': '有料コンテンツ',
                'file': 'spreadsheet_data/premium_content_enhancement.csv'
            },
            'research_log': {
                'id': '1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI',
                'name': '研究開発ログ',
                'file': 'spreadsheet_data/research_log_final.csv'
            }
        }
        
        # WebApp URL（GASバージョン2）
        self.webapp_url = "https://script.google.com/macros/s/AKfycbwOqZhF4Np1n_le6AwaiEHoAWN-QmNz6sgRFLTA78fQ19Bjgdl-mTriHkdnnDrQZ5wwuw/exec"
    
    def show_gas_code(self):
        """GAS WebAppコード表示"""
        print("🚀 Google Apps Script WebAppコード")
        print("=" * 50)
        
        gas_code = f'''
function doPost(e) {{
  const SHEETS = {{
    'salon_basic': '1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g',
    'free_benefits': '1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs',
    'premium_content': '1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ',
    'research_log': '1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI'
  }};
  
  try {{
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEETS[data.sheet_key]).getActiveSheet();
    sheet.appendRow(data.row_data);
    
    return ContentService.createTextOutput(JSON.stringify({{
      result: 'success',
      timestamp: new Date().toISOString()
    }})).setMimeType(ContentService.MimeType.JSON);
    
  }} catch (error) {{
    return ContentService.createTextOutput(JSON.stringify({{
      result: 'error',
      error: error.toString()
    }})).setMimeType(ContentService.MimeType.JSON);
  }}
}}
'''
        print(gas_code)
        print("=" * 50)
        print("1. script.google.com で新プロジェクト")
        print("2. 上記コードをペースト")  
        print("3. デプロイ → ウェブアプリ → 全員アクセス")
        print("4. WebアプリURLをコピー")
    
    def set_webapp_url(self, url):
        """WebApp URL設定"""
        self.webapp_url = url
        print(f"✅ WebApp URL設定完了: {url}")
    
    def write_to_sheet(self, sheet_key, row_data, clear_first=False):
        """1行をスプレッドシートに書き込み"""
        if not self.webapp_url:
            return {'success': False, 'error': 'WebApp URL未設定'}
        
        payload = {
            'sheet_key': sheet_key,
            'row_data': row_data,
            'clear_first': clear_first  # クリア機能追加
        }
        
        try:
            response = requests.post(
                self.webapp_url,
                data=json.dumps(payload),
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                return {'success': result.get('result') == 'success', 'data': result}
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def clear_and_rebuild_sheet(self, sheet_key, data_rows):
        """シートクリア+複数行書き込み"""
        if not data_rows:
            return {'success': False, 'error': 'データが空です'}
        
        results = []
        total_success = 0
        
        for i, row in enumerate(data_rows):
            clear_flag = (i == 0)  # 最初の行のみクリア
            result = self.write_to_sheet(sheet_key, row, clear_flag)
            results.append(result)
            
            if result['success']:
                total_success += 1
                action = result['data'].get('action', 'unknown')
                status = "🧹 CLEAR+WRITE" if clear_flag else "📝 APPEND"
                print(f"  {status} {i+1}: {row[0][:30]}... → {action}")
            else:
                print(f"  ❌ {i+1}: {result['error']}")
        
        return {
            'success': total_success > 0,
            'total_rows': len(data_rows),
            'success_count': total_success,
            'results': results
        }
    
    def write_all_data(self):
        """全CSVデータをスプレッドシートに書き込み"""
        if not self.webapp_url:
            print("❌ WebApp URL未設定。先にset_webapp_url()を実行してください")
            return
        
        print("🤖 AI副業サロン - 全スプレッドシート書き込み開始")
        print("=" * 50)
        
        total_written = 0
        
        for sheet_key, config in self.sheets.items():
            csv_file = config['file']
            sheet_name = config['name']
            
            print(f"\n📊 {sheet_name} 書き込み中...")
            
            if not os.path.exists(csv_file):
                print(f"❌ ファイルなし: {csv_file}")
                continue
            
            success_count = 0
            
            with open(csv_file, 'r', encoding='utf-8') as f:
                csv_reader = csv.reader(f)
                for row_num, row in enumerate(csv_reader, 1):
                    if row and any(cell.strip() for cell in row):
                        result = self.write_to_sheet(sheet_key, row)
                        
                        if result['success']:
                            success_count += 1
                            total_written += 1
                            print(f"  ✅ {row_num}: {row[0][:30]}...")
                        else:
                            print(f"  ❌ {row_num}: {result['error']}")
            
            print(f"📋 {sheet_name}: {success_count}行書き込み完了")
        
        print(f"\n🎉 全体完了: {total_written}行書き込み")
        print("\n🔍 結果確認:")
        for config in self.sheets.values():
            print(f"  {config['name']}: https://docs.google.com/spreadsheets/d/{config['id']}/")
    
    def show_data_preview(self):
        """データプレビュー表示"""
        print("📋 書き込み予定データプレビュー")
        print("=" * 50)
        
        for sheet_key, config in self.sheets.items():
            csv_file = config['file']
            sheet_name = config['name']
            
            print(f"\n📊 {sheet_name}")
            print(f"📁 {csv_file}")
            
            if os.path.exists(csv_file):
                with open(csv_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()[:5]  # 最初の5行のみ
                    for i, line in enumerate(lines, 1):
                        print(f"  {i}: {line.strip()[:60]}...")
                print(f"  ... (計{len(f.readlines())}行)")
            else:
                print("  ❌ ファイルが見つかりません")

def main():
    """メイン実行"""
    writer = SalonSheetsWriter()
    
    print("🤖 AI副業サロン - スプレッドシート書き込みシステム")
    print("=" * 50)
    print("1. 📋 データプレビュー表示")
    print("2. 🚀 GASコード表示")
    print("3. 📝 WebApp URL設定")
    print("4. ⚡ 全データ書き込み実行")
    
    while True:
        choice = input("\n選択 (1-4, q=終了): ").strip()
        
        if choice == '1':
            writer.show_data_preview()
        
        elif choice == '2':
            writer.show_gas_code()
        
        elif choice == '3':
            url = input("WebApp URL: ").strip()
            if url:
                writer.set_webapp_url(url)
            else:
                print("❌ URLが必要です")
        
        elif choice == '4':
            writer.write_all_data()
        
        elif choice.lower() == 'q':
            print("👋 終了")
            break
        
        else:
            print("❌ 1-4またはqを入力してください")

if __name__ == "__main__":
    main()