function doPost(e) {
  const SHEETS = {
    'salon_basic': '1ruPY-uTgChB0CSU5D2v2r7uA7-hKmG3LAh4CeQXkc0g',
    'free_benefits': '1N0oF2kb4jxkfwfygmaWDNsihJjUbncjo7xXmCxY3hRs',
    'premium_content': '1EYllt8YNDqGgnqO1YpRIeacxdygVtGeNaVTRX1437rQ',
    'research_log': '1t_OozWsoqxVaddtaZtN6UZcXEhffBQT3GKtOdoR1BaI'
  };
  
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEETS[data.sheet_key]).getActiveSheet();
    
    // 🧹 CLEAR機能: 既存データを全削除してから書き込み
    if (data.clear_first === true) {
      sheet.clear(); // 全シートクリア
      sheet.appendRow(data.row_data);
      
      return ContentService.createTextOutput(JSON.stringify({
        result: 'success',
        action: 'clear_and_write',
        message: '🧹 Sheet cleared and new data written',
        timestamp: new Date().toISOString(),
        rows_cleared: true
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 📝 APPEND機能: 通常の追記
    sheet.appendRow(data.row_data);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      action: 'append',
      message: '📝 Row appended successfully',
      timestamp: new Date().toISOString(),
      rows_cleared: false
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      action: 'error',
      error: error.toString(),
      message: '❌ Operation failed',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}