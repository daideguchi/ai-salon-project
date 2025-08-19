#!/usr/bin/env node

/**
 * LINE公式アカウント設定自動化スクリプト
 * 環境変数確認、リッチメニュー作成、Webhook設定検証を自動実行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定定数
const CONFIG = {
  ENV_FILE: '.env.local',
  REQUIRED_VARS: [
    'LINE_CHANNEL_ACCESS_TOKEN',
    'LINE_CHANNEL_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ],
  OPTIONAL_VARS: [
    'LINE_RICH_MENU_ID',
    'DISCORD_BOT_TOKEN'
  ],
  WEBHOOK_PATHS: [
    '/api/line/webhook'
  ]
};

// カラー出力関数
const colors = {
  reset: '\\033[0m',
  bright: '\\033[1m',
  red: '\\033[31m',
  green: '\\033[32m',
  yellow: '\\033[33m',
  blue: '\\033[34m',
  magenta: '\\033[35m',
  cyan: '\\033[36m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 環境変数読み込み・検証
function loadEnvironmentVariables() {
  colorLog('🔍 環境変数確認中...', 'cyan');
  
  const envPath = path.join(process.cwd(), CONFIG.ENV_FILE);
  const missing = [];
  const present = [];
  
  // .env.local ファイル存在確認
  if (!fs.existsSync(envPath)) {
    colorLog(`❌ ${CONFIG.ENV_FILE} ファイルが見つかりません`, 'red');
    colorLog(`📋 ${path.resolve(envPath)} を作成してください`, 'yellow');
    return { success: false, missing: CONFIG.REQUIRED_VARS };
  }
  
  // 環境変数内容読み込み
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  // 必須変数チェック
  CONFIG.REQUIRED_VARS.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== 'your_' + varName.toLowerCase() + '_here') {
      present.push(varName);
      colorLog(`  ✅ ${varName}`, 'green');
    } else {
      missing.push(varName);
      colorLog(`  ❌ ${varName}`, 'red');
    }
  });
  
  // オプション変数チェック
  CONFIG.OPTIONAL_VARS.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== '') {
      colorLog(`  📋 ${varName} (optional)`, 'blue');
    } else {
      colorLog(`  ⚪ ${varName} (optional, not set)`, 'yellow');
    }
  });
  
  if (missing.length > 0) {
    colorLog(`\\n❌ ${missing.length}個の必須環境変数が不足しています:`, 'red');
    missing.forEach(varName => {
      colorLog(`   - ${varName}`, 'red');
    });
    return { success: false, missing, present, envVars };
  }
  
  colorLog(`\\n✅ 環境変数設定完了 (${present.length}/${CONFIG.REQUIRED_VARS.length})`, 'green');
  return { success: true, missing: [], present, envVars };
}

// リッチメニュー作成・設定
async function setupRichMenu(envVars) {
  colorLog('\\n🎨 リッチメニュー設定中...', 'cyan');
  
  const richMenuScript = path.join(process.cwd(), 'scripts', 'line-richmenu-setup.js');
  
  if (!fs.existsSync(richMenuScript)) {
    colorLog('❌ リッチメニュー設定スクリプトが見つかりません', 'red');
    return { success: false, error: 'Script not found' };
  }
  
  try {
    // 環境変数設定
    const env = { ...process.env };
    Object.entries(envVars).forEach(([key, value]) => {
      env[key] = value;
    });
    
    colorLog('📋 リッチメニュー作成実行中...', 'blue');
    
    // リッチメニュー作成実行
    const output = execSync(`node "${richMenuScript}" create`, { 
      env,
      encoding: 'utf8',
      timeout: 30000
    });
    
    colorLog('✅ リッチメニュー作成完了', 'green');
    colorLog(output, 'blue');
    
    return { success: true, output };
    
  } catch (error) {
    colorLog(`❌ リッチメニュー作成エラー: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// Webhook URL検証
async function validateWebhookUrls() {
  colorLog('\\n🌐 Webhook URL検証中...', 'cyan');
  
  const testScript = path.join(process.cwd(), 'scripts', 'test-line-webhook.js');
  
  if (!fs.existsSync(testScript)) {
    colorLog('❌ Webhook テストスクリプトが見つかりません', 'red');
    return { success: false, error: 'Test script not found' };
  }
  
  try {
    colorLog('📋 Webhook エンドポイントテスト実行中...', 'blue');
    
    const output = execSync(`node "${testScript}" --json`, { 
      encoding: 'utf8',
      timeout: 60000
    });
    
    // JSON結果を抽出
    const jsonMatch = output.match(/📄 JSON Results:\\n(.*?)$/s);
    if (jsonMatch) {
      const results = JSON.parse(jsonMatch[1]);
      
      colorLog('✅ Webhook URL検証完了', 'green');
      colorLog(`📊 成功率: ${results.summary.passed}/${results.summary.total}`, 'blue');
      
      return { success: true, results };
    } else {
      colorLog('⚠️ Webhook URL検証完了（結果解析失敗）', 'yellow');
      return { success: true, output };
    }
    
  } catch (error) {
    colorLog(`❌ Webhook URL検証エラー: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// Next.js 開発サーバー確認
function checkDevelopmentServer() {
  colorLog('\\n🔧 開発環境確認中...', 'cyan');
  
  try {
    // package.json 確認
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      colorLog('❌ package.json が見つかりません', 'red');
      return { success: false };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    colorLog('📋 プロジェクト情報:', 'blue');
    colorLog(`   名前: ${packageJson.name}`, 'blue');
    colorLog(`   バージョン: ${packageJson.version}`, 'blue');
    
    // スクリプト確認
    if (packageJson.scripts) {
      const scripts = ['dev', 'build', 'start'];
      scripts.forEach(script => {
        if (packageJson.scripts[script]) {
          colorLog(`   ✅ npm run ${script}: ${packageJson.scripts[script]}`, 'green');
        } else {
          colorLog(`   ❌ npm run ${script}: 未定義`, 'red');
        }
      });
    }
    
    colorLog('✅ 開発環境確認完了', 'green');
    return { success: true, packageJson };
    
  } catch (error) {
    colorLog(`❌ 開発環境確認エラー: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

// 設定レポート生成
function generateReport(results) {
  colorLog('\\n📋 設定レポート生成中...', 'cyan');
  
  const report = {
    timestamp: new Date().toISOString(),
    environment: results.env,
    richMenu: results.richMenu,
    webhook: results.webhook,
    development: results.development,
    recommendations: []
  };
  
  // 推奨事項生成
  if (!results.env.success) {
    report.recommendations.push('環境変数を設定してください');
  }
  
  if (!results.richMenu.success) {
    report.recommendations.push('リッチメニューを手動で設定してください');
  }
  
  if (!results.webhook.success) {
    report.recommendations.push('Webhook URLを確認してください');
  }
  
  // レポートファイル保存
  const reportPath = path.join(process.cwd(), 'line-setup-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  colorLog(`✅ 設定レポート保存: ${reportPath}`, 'green');
  
  return report;
}

// メイン実行関数
async function main() {
  colorLog('🚀 LINE公式アカウント設定自動化開始\\n', 'bright');
  
  const results = {
    env: { success: false },
    richMenu: { success: false },
    webhook: { success: false },
    development: { success: false }
  };
  
  try {
    // 1. 環境変数確認
    results.env = loadEnvironmentVariables();
    
    // 2. 開発環境確認
    results.development = checkDevelopmentServer();
    
    // 3. リッチメニュー設定（環境変数が設定されている場合のみ）
    if (results.env.success) {
      results.richMenu = await setupRichMenu(results.env.envVars);
    } else {
      colorLog('\\n⚠️ 環境変数が不足しているため、リッチメニュー設定をスキップします', 'yellow');
    }
    
    // 4. Webhook URL検証
    results.webhook = await validateWebhookUrls();
    
    // 5. 設定レポート生成
    const report = generateReport(results);
    
    // 6. 最終結果
    colorLog('\\n🎯 設定自動化完了', 'bright');
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    
    if (successCount === totalCount) {
      colorLog(`✅ 全設定完了 (${successCount}/${totalCount})`, 'green');
      colorLog('🚀 LINE公式アカウント運用開始可能です！', 'green');
    } else {
      colorLog(`⚠️ 一部設定未完了 (${successCount}/${totalCount})`, 'yellow');
      colorLog('📋 設定レポートを確認して、残りの設定を完了してください', 'yellow');
    }
    
    if (report.recommendations.length > 0) {
      colorLog('\\n📋 推奨事項:', 'cyan');
      report.recommendations.forEach((rec, index) => {
        colorLog(`   ${index + 1}. ${rec}`, 'yellow');
      });
    }
    
    process.exit(successCount === totalCount ? 0 : 1);
    
  } catch (error) {
    colorLog(`❌ 設定自動化エラー: ${error.message}`, 'red');
    process.exit(1);
  }
}

// スクリプト直接実行時
if (require.main === module) {
  main();
}

module.exports = {
  loadEnvironmentVariables,
  setupRichMenu,
  validateWebhookUrls,
  checkDevelopmentServer,
  generateReport
};