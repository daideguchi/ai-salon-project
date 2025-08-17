#!/usr/bin/env python3
"""
AI副業サロンプロジェクト - Google Sheets直接書き込みシステム
Google Apps Script WebAppを使用してスプレッドシートにデータを送信
"""

import requests
import json
import csv
import os
from typing import List, Dict, Any

class GoogleSheetsWriter:
    def __init__(self, webapp_url: str = None):
        """
        Google Apps Script WebApp URL を設定
        
        Args:
            webapp_url: Google Apps ScriptとしてデプロイされたWebアプリのURL
        """
        self.webapp_url = webapp_url or "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
        
    def write_to_sheet(self, sheet_type: str, data: List[Any]) -> Dict[str, Any]:
        """
        スプレッドシートに1行のデータを書き込み
        
        Args:
            sheet_type: 書き込み先シート ('salon_basic', 'free_benefits', 'premium_content', 'research_log')
            data: 書き込むデータの配列
            
        Returns:
            dict: レスポンス結果
        """
        payload = {
            'sheet_type': sheet_type,
            'data': data
        }
        
        try:
            response = requests.post(
                self.webapp_url,
                data=json.dumps(payload),
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            return {
                'result': 'error',
                'error': f'Request failed: {str(e)}'
            }
        except json.JSONDecodeError as e:
            return {
                'result': 'error', 
                'error': f'Invalid JSON response: {str(e)}'
            }
    
    def write_csv_to_sheet(self, sheet_type: str, csv_file_path: str) -> Dict[str, Any]:
        """
        CSVファイルのデータをスプレッドシートに一括書き込み
        
        Args:
            sheet_type: 書き込み先シート
            csv_file_path: CSVファイルのパス
            
        Returns:
            dict: 処理結果
        """
        if not os.path.exists(csv_file_path):
            return {
                'result': 'error',
                'error': f'CSV file not found: {csv_file_path}'
            }
        
        results = []
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.reader(file)
                
                for row_num, row in enumerate(csv_reader, 1):
                    if row:  # 空行をスキップ
                        result = self.write_to_sheet(sheet_type, row)
                        results.append({
                            'row': row_num,
                            'data': row,
                            'result': result
                        })
                        
                        # API レート制限対策（1秒待機）
                        import time
                        time.sleep(1)
            
            success_count = sum(1 for r in results if r['result'].get('result') == 'success')
            
            return {
                'result': 'completed',
                'total_rows': len(results),
                'success_count': success_count,
                'failed_count': len(results) - success_count,
                'details': results
            }
            
        except Exception as e:
            return {
                'result': 'error',
                'error': f'CSV processing failed: {str(e)}'
            }
    
    def test_connection(self) -> Dict[str, Any]:
        """
        WebApp接続をテスト（GET リクエスト）
        
        Returns:
            dict: 接続テスト結果
        """
        try:
            response = requests.get(self.webapp_url, timeout=10)
            return response.json()
            
        except requests.exceptions.RequestException as e:
            return {
                'result': 'error',
                'error': f'Connection test failed: {str(e)}'
            }
        except json.JSONDecodeError as e:
            return {
                'result': 'error',
                'error': f'Invalid JSON response: {str(e)}'
            }

def upload_all_enhancement_data(webapp_url: str = None):
    """
    全ての拡張データをスプレッドシートにアップロード
    """
    writer = GoogleSheetsWriter(webapp_url)
    
    # テスト接続
    print("🔗 WebApp接続テスト中...")
    test_result = writer.test_connection()
    print(f"接続テスト結果: {test_result}")
    
    if test_result.get('result') == 'error':
        print("❌ WebApp接続失敗。URLを確認してください。")
        return
    
    # CSVファイルマッピング
    csv_files = {
        'salon_basic': 'spreadsheet_data/salon_basic_enhancement.csv',
        'free_benefits': 'spreadsheet_data/free_benefits_enhancement.csv', 
        'premium_content': 'spreadsheet_data/premium_content_enhancement.csv',
        'research_log': 'spreadsheet_data/research_log_final.csv'
    }
    
    results = {}
    
    for sheet_type, csv_file in csv_files.items():
        print(f"\n📊 {sheet_type} へのデータアップロード開始...")
        
        if os.path.exists(csv_file):
            result = writer.write_csv_to_sheet(sheet_type, csv_file)
            results[sheet_type] = result
            
            if result.get('result') == 'completed':
                print(f"✅ {sheet_type}: {result['success_count']}/{result['total_rows']} 行成功")
            else:
                print(f"❌ {sheet_type}: {result.get('error', 'Unknown error')}")
        else:
            print(f"⚠️ {sheet_type}: CSVファイルが見つかりません ({csv_file})")
            results[sheet_type] = {'result': 'error', 'error': 'CSV file not found'}
    
    print(f"\n📋 全体結果:")
    for sheet_type, result in results.items():
        status = "✅" if result.get('result') == 'completed' else "❌"
        print(f"  {status} {sheet_type}: {result.get('result', 'error')}")
    
    return results

if __name__ == "__main__":
    print("🚀 AI副業サロン - Google Sheets書き込みシステム")
    print("⚠️  注意: 実行前にGoogle Apps Script WebAppのURLを設定してください")
    
    # デモ実行
    # webapp_url = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
    # upload_all_enhancement_data(webapp_url)