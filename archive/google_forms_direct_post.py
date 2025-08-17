#!/usr/bin/env python3
"""
最も簡単なブレイクスルー：Google Forms直接POST法
外部サービス不要・認証不要・設定5分
"""

import requests
import time
import csv
import os

class GoogleFormsDirectPoster:
    """
    Google Formsに直接POSTしてスプレッドシートに書き込む
    """
    
    def __init__(self):
        # 各スプレッドシート用のGoogle Formsを作成後、ここに設定
        self.form_configs = {
            'salon_basic': {
                'form_id': 'YOUR_SALON_BASIC_FORM_ID',
                'entries': {
                    'field1': 'entry.123456789',  # 項目
                    'field2': 'entry.987654321',  # 内容  
                    'field3': 'entry.555555555',  # 備考
                }
            },
            'free_benefits': {
                'form_id': 'YOUR_FREE_BENEFITS_FORM_ID',
                'entries': {
                    'field1': 'entry.111111111',
                    'field2': 'entry.222222222',
                    'field3': 'entry.333333333',
                }
            },
            'premium_content': {
                'form_id': 'YOUR_PREMIUM_CONTENT_FORM_ID', 
                'entries': {
                    'field1': 'entry.444444444',
                    'field2': 'entry.555555555',
                    'field3': 'entry.666666666',
                }
            },
            'research_log': {
                'form_id': 'YOUR_RESEARCH_LOG_FORM_ID',
                'entries': {
                    'field1': 'entry.777777777',
                    'field2': 'entry.888888888',
                    'field3': 'entry.999999999',
                }
            }
        }
    
    def find_entry_parameters(self, form_url):
        """
        Google Formページを解析してentry.パラメータを見つける
        """
        javascript_code = '''
        // Google Formページで実行するJavaScriptコード
        function findEntryParameters(){
            const entries = [];
            function loop(e){
                if(e.children)
                    for(let i=0; i<e.children.length; i++){
                        let c = e.children[i], n = c.getAttribute('name');
                        if(n && n.startsWith('entry.')) {
                            const label = c.getAttribute('aria-label') || 
                                         c.getAttribute('data-label') ||
                                         c.parentElement.querySelector('label')?.textContent ||
                                         'Unknown Field';
                            entries.push({label: label.trim(), entry: n});
                        }
                        loop(e.children[i]);
                     }
            }
            loop(document.body);
            return entries;
        }
        
        console.log('=== Google Form Entry Parameters ===');
        const params = findEntryParameters();
        params.forEach(p => console.log(`${p.label}: ${p.entry}`));
        console.log('=====================================');
        '''
        
        print("🔍 Google Formのentry.パラメータを見つける方法:")
        print("1. Google Formページを開く")
        print("2. ブラウザの開発者ツール(F12)を開く")
        print("3. Consoleタブで以下のコードを実行:")
        print("\n" + javascript_code)
        return javascript_code
    
    def submit_to_form(self, sheet_type, data_row):
        """
        Google Formに直接POSTしてデータを送信
        """
        if sheet_type not in self.form_configs:
            return {'error': f'Unknown sheet type: {sheet_type}'}
        
        config = self.form_configs[sheet_type]
        form_id = config['form_id']
        
        if form_id == f'YOUR_{sheet_type.upper()}_FORM_ID':
            return {'error': 'Form ID not configured'}
        
        # POSTリクエストURL
        post_url = f"https://docs.google.com/forms/d/e/{form_id}/formResponse"
        
        # データをentry.パラメータにマッピング
        post_data = {}
        entry_keys = list(config['entries'].values())
        
        for i, value in enumerate(data_row):
            if i < len(entry_keys):
                post_data[entry_keys[i]] = value
        
        try:
            # POSTリクエスト送信
            response = requests.post(
                post_url,
                data=post_data,
                timeout=30,
                allow_redirects=True
            )
            
            # Googleはフォーム送信後にリダイレクトするので200/302両方成功
            if response.status_code in [200, 302]:
                return {'success': True, 'status_code': response.status_code}
            else:
                return {'error': f'HTTP {response.status_code}'}
                
        except requests.exceptions.RequestException as e:
            return {'error': f'Request failed: {str(e)}'}
    
    def upload_csv_to_forms(self, sheet_type, csv_file_path):
        """
        CSVファイルの全データをGoogle Formに送信
        """
        if not os.path.exists(csv_file_path):
            return {'error': f'CSV file not found: {csv_file_path}'}
        
        results = []
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.reader(file)
                
                for row_num, row in enumerate(csv_reader, 1):
                    if row and any(cell.strip() for cell in row):  # 空行スキップ
                        result = self.submit_to_form(sheet_type, row)
                        results.append({
                            'row': row_num,
                            'data': row,
                            'result': result
                        })
                        
                        print(f"Row {row_num}: {'✅' if result.get('success') else '❌'} {row[0][:30]}...")
                        
                        # レート制限対策
                        time.sleep(0.5)
            
            success_count = sum(1 for r in results if r['result'].get('success'))
            
            return {
                'success': True,
                'total_rows': len(results),
                'success_count': success_count,
                'failed_count': len(results) - success_count,
                'details': results
            }
            
        except Exception as e:
            return {'error': f'CSV processing failed: {str(e)}'}

def setup_forms_guide():
    """
    Google Forms設定ガイドを表示
    """
    print("🚀 Google Forms直接POST法 - 5分設定ガイド")
    print("=" * 60)
    
    spreadsheets = [
        ("サロン基本設計", "1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g"),
        ("無料特典設計", "1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs"), 
        ("有料コンテンツ", "1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ"),
        ("研究開発ログ", "1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI")
    ]
    
    print("📋 各スプレッドシートにGoogle Formを作成:")
    
    for i, (name, sheet_id) in enumerate(spreadsheets, 1):
        print(f"\n{i}. {name}")
        print(f"   📊 Spreadsheet: https://docs.google.com/spreadsheets/d/{sheet_id}/")
        print(f"   ➕ New Form: https://forms.google.com/")
        print(f"   🔗 Link to Sheet: フォーム設定 → 回答 → スプレッドシートを選択")
    
    print("\n🔍 Entry Parameters取得方法:")
    print("1. 作成したGoogle Formを開く")
    print("2. ブラウザ開発者ツール(F12) → Console")
    print("3. find_entry_parameters()関数実行")
    print("4. 表示されたentry.番号をコードに設定")
    
    print("\n✅ 設定完了後:")
    print("python3 google_forms_direct_post.py")

def main():
    """
    メイン実行関数
    """
    poster = GoogleFormsDirectPoster()
    
    print("🎯 Google Forms直接POST - 最も簡単なブレイクスルー")
    print("🌍 世界で最もシンプルなGoogle Sheets書き込み法")
    
    # 設定チェック
    configured_forms = sum(1 for config in poster.form_configs.values() 
                          if not config['form_id'].startswith('YOUR_'))
    
    if configured_forms == 0:
        print("\n⚠️ フォーム設定が必要です")
        setup_forms_guide()
        return
    
    print(f"\n✅ {configured_forms}/4 フォーム設定済み")
    
    # CSVファイルアップロード
    csv_files = {
        'salon_basic': 'spreadsheet_data/salon_basic_enhancement.csv',
        'free_benefits': 'spreadsheet_data/free_benefits_enhancement.csv',
        'premium_content': 'spreadsheet_data/premium_content_enhancement.csv', 
        'research_log': 'spreadsheet_data/research_log_final.csv'
    }
    
    for sheet_type, csv_file in csv_files.items():
        if os.path.exists(csv_file):
            print(f"\n📊 {sheet_type} アップロード中...")
            result = poster.upload_csv_to_forms(sheet_type, csv_file)
            
            if result.get('success'):
                print(f"✅ 完了: {result['success_count']}/{result['total_rows']} 行")
            else:
                print(f"❌ エラー: {result.get('error')}")

if __name__ == "__main__":
    poster = GoogleFormsDirectPoster()
    print(poster.find_entry_parameters(""))
    main()