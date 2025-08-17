#!/usr/bin/env python3
"""
2025年版：AIエージェント直接書き込みシステム
Claude AIが実際にGoogle Sheetsに直接データを書き込み
"""

import requests
import json
import time
import os
import csv

class AIAgentSheetsWriter:
    """
    AIエージェント（Claude）によるGoogle Sheets直接書き込みシステム
    """
    
    def __init__(self):
        # 2025年版Google Apps Script WebApp URL（設定後に更新）
        self.webapp_url = "https://script.google.com/macros/s/AKfycbzjvGGGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQGQG/exec"
        
        # スプレッドシート情報
        self.spreadsheets = {
            'salon_basic': {
                'id': '1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g',
                'name': 'サロン基本設計',
                'csv_file': 'spreadsheet_data/salon_basic_enhancement.csv'
            },
            'free_benefits': {
                'id': '1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs',
                'name': '無料特典設計',
                'csv_file': 'spreadsheet_data/free_benefits_enhancement.csv'
            },
            'premium_content': {
                'id': '1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ',
                'name': '有料コンテンツ',
                'csv_file': 'spreadsheet_data/premium_content_enhancement.csv'
            },
            'research_log': {
                'id': '1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI',
                'name': '研究開発ログ',
                'csv_file': 'spreadsheet_data/research_log_final.csv'
            }
        }
    
    def quick_webapp_setup(self):
        """
        WebApp 5分クイックセットアップガイド
        """
        print("🚀 2025年版 AIエージェント → Google Sheets 直接書き込み")
        print("⚡ 5分クイックセットアップ")
        print("=" * 60)
        
        print("📋 手順:")
        print("1. https://script.google.com → 新しいプロジェクト")
        print("2. 以下のコードをコピペ:")
        
        webapp_code = '''
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetId = data.sheet_id;
    const rowData = data.row_data;
    
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'timestamp': new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
'''
        
        print(webapp_code)
        print("\n3. デプロイ → 新しいデプロイ → ウェブアプリ")
        print("4. アクセスできるユーザー: 全員")
        print("5. WebアプリURL をコピー")
        print("6. このスクリプトのwebapp_urlを更新")
        
        return webapp_code
    
    def write_row_to_sheet(self, sheet_id, row_data):
        """
        AIエージェントが単一行をスプレッドシートに書き込み
        """
        payload = {
            'sheet_id': sheet_id,
            'row_data': row_data
        }
        
        try:
            response = requests.post(
                self.webapp_url,
                data=json.dumps(payload),
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {'success': True, 'result': result}
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def ai_agent_mass_upload(self):
        """
        AIエージェントによる全データ一括アップロード
        """
        print("🤖 AIエージェント（Claude）による直接書き込み開始...")
        print("=" * 50)
        
        total_written = 0
        
        for sheet_key, info in self.spreadsheets.items():
            csv_file = info['csv_file']
            sheet_id = info['id']
            sheet_name = info['name']
            
            print(f"\n📊 {sheet_name} への書き込み開始...")
            
            if not os.path.exists(csv_file):
                print(f"❌ CSVファイルが見つかりません: {csv_file}")
                continue
            
            success_count = 0
            
            try:
                with open(csv_file, 'r', encoding='utf-8') as file:
                    csv_reader = csv.reader(file)
                    
                    for row_num, row in enumerate(csv_reader, 1):
                        if row and any(cell.strip() for cell in row):
                            print(f"  📝 Row {row_num}: {row[0][:40]}...")
                            
                            result = self.write_row_to_sheet(sheet_id, row)
                            
                            if result['success']:
                                success_count += 1
                                total_written += 1
                                print(f"    ✅ 書き込み成功")
                            else:
                                print(f"    ❌ エラー: {result['error']}")
                            
                            # AIエージェント書き込み間隔
                            time.sleep(1)
                
                print(f"📋 {sheet_name} 完了: {success_count} 行書き込み")
                
            except Exception as e:
                print(f"❌ {sheet_name} 処理エラー: {e}")
        
        print(f"\n🎉 AIエージェント書き込み完了!")
        print(f"📊 総書き込み行数: {total_written} 行")
        print("\n🔍 結果確認:")
        for info in self.spreadsheets.values():
            print(f"  - {info['name']}: https://docs.google.com/spreadsheets/d/{info['id']}/")
        
        return total_written
    
    def test_webapp_connection(self):
        """
        WebApp接続テスト
        """
        print("🔗 WebApp接続テスト...")
        
        test_data = ['AIエージェントテスト', '2025年版書き込み', time.strftime('%Y-%m-%d %H:%M:%S')]
        test_sheet_id = self.spreadsheets['salon_basic']['id']
        
        result = self.write_row_to_sheet(test_sheet_id, test_data)
        
        if result['success']:
            print("✅ 接続成功! AIエージェント書き込み準備完了")
            return True
        else:
            print(f"❌ 接続失敗: {result['error']}")
            print("⚠️  WebApp URLの設定を確認してください")
            return False

def main():
    """
    AIエージェント書き込みメイン実行
    """
    print("🤖 Claude AIエージェント → Google Sheets 直接書き込みシステム")
    print("🌟 2025年版最新手法")
    print()
    
    writer = AIAgentSheetsWriter()
    
    # WebApp URL確認
    if "AKfycbzjvGGGQGQGQ" in writer.webapp_url:
        print("⚠️  WebApp URL未設定")
        print("📋 5分クイックセットアップを実行:")
        writer.quick_webapp_setup()
        
        print("\n💡 WebApp URL設定後に再実行してください:")
        print("   python3 ai_agent_direct_writer.py")
        return
    
    # 接続テスト
    if not writer.test_webapp_connection():
        return
    
    # AIエージェント書き込み実行
    print("\n🚀 AIエージェント大量書き込み開始...")
    input("Enterキーで開始 (またはCtrl+Cで中止): ")
    
    total_rows = writer.ai_agent_mass_upload()
    
    if total_rows > 0:
        print(f"\n🎊 SUCCESS: AIエージェントが {total_rows} 行を直接書き込み完了!")
        print("🌟 これがAIエージェント書き込みの真の価値です!")
    else:
        print("\n❌ 書き込み失敗。設定を確認してください。")

if __name__ == "__main__":
    main()