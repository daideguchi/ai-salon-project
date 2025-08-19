#!/usr/bin/env node

/**
 * LINE Webhook エンドポイント自動テストスクリプト
 * 複数のデプロイメントプラットフォームでLINE Bot APIの動作確認を行う
 */

const https = require('https');

// テストURLs
const ENDPOINTS = {
  vercel: 'https://portal-ir60ihqni-daideguchis-projects.vercel.app',
  railway: 'https://ai-salon-portal-production.up.railway.app',
  localhost: 'http://localhost:3001'
};

// テストケース
const TEST_CASES = [
  {
    name: 'GET Webhook Endpoint',
    method: 'GET',
    path: '/api/line/webhook',
    expectedStatus: [405, 401, 200] // Method Not Allowed or Auth Required is OK
  },
  {
    name: 'POST Webhook Endpoint (Mock)',
    method: 'POST',
    path: '/api/line/webhook',
    body: {
      events: [],
      destination: 'test'
    },
    expectedStatus: [401, 400, 200] // Auth Required or Bad Request is OK
  },
  {
    name: 'Main Page',
    method: 'GET',
    path: '/',
    expectedStatus: [200, 401] // OK or Auth Required
  }
];

// HTTP/HTTPS リクエスト関数
function makeRequest(url, options, body = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : require('http');
    
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LINE-Webhook-Tester/1.0',
        ...options.headers
      },
      timeout: 10000
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          success: true
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        error: 'Request timeout',
        success: false
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// 単一テスト実行
async function runTest(baseUrl, testCase) {
  console.log(`  📋 ${testCase.name}...`);
  
  const url = baseUrl + testCase.path;
  const options = {
    method: testCase.method,
    headers: testCase.headers || {}
  };

  try {
    const result = await makeRequest(url, options, testCase.body);
    
    if (!result.success) {
      console.log(`    ❌ Failed: ${result.error}`);
      return { success: false, error: result.error };
    }

    const statusOk = testCase.expectedStatus.includes(result.status);
    const statusIcon = statusOk ? '✅' : '⚠️';
    
    console.log(`    ${statusIcon} Status: ${result.status} (${statusOk ? 'Expected' : 'Unexpected'})`);
    
    // レスポンス内容の基本チェック
    if (result.body) {
      const bodySnippet = result.body.substring(0, 100).replace(/\\n/g, ' ');
      console.log(`    📄 Response: ${bodySnippet}${result.body.length > 100 ? '...' : ''}`);
    }

    return {
      success: statusOk,
      status: result.status,
      body: result.body,
      expected: statusOk
    };
  } catch (error) {
    console.log(`    ❌ Exception: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 全エンドポイントテスト実行
async function runAllTests() {
  console.log('🚀 LINE Webhook エンドポイント自動テスト開始\\n');
  
  const results = {};
  
  for (const [platform, baseUrl] of Object.entries(ENDPOINTS)) {
    console.log(`🌐 Testing ${platform.toUpperCase()}: ${baseUrl}`);
    results[platform] = {};
    
    for (const testCase of TEST_CASES) {
      const result = await runTest(baseUrl, testCase);
      results[platform][testCase.name] = result;
      
      // テスト間の間隔
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(''); // 空行
  }
  
  return results;
}

// 結果サマリー生成
function generateSummary(results) {
  console.log('📊 テスト結果サマリー\\n');
  
  const summary = {
    total: 0,
    passed: 0,
    failed: 0,
    platforms: {}
  };

  for (const [platform, tests] of Object.entries(results)) {
    const platformSummary = { passed: 0, failed: 0, total: 0 };
    
    console.log(`${platform.toUpperCase()}:`);
    
    for (const [testName, result] of Object.entries(tests)) {
      platformSummary.total++;
      const icon = result.success ? '✅' : '❌';
      console.log(`  ${icon} ${testName}`);
      
      if (result.success) {
        platformSummary.passed++;
        summary.passed++;
      } else {
        platformSummary.failed++;
        summary.failed++;
      }
    }
    
    summary.total += platformSummary.total;
    summary.platforms[platform] = platformSummary;
    console.log(`  📈 ${platformSummary.passed}/${platformSummary.total} passed\\n`);
  }

  console.log(`🎯 総合結果: ${summary.passed}/${summary.total} passed`);
  
  // 推奨プラットフォーム
  let bestPlatform = null;
  let bestScore = -1;
  
  for (const [platform, stats] of Object.entries(summary.platforms)) {
    const score = stats.passed / stats.total;
    if (score > bestScore) {
      bestScore = score;
      bestPlatform = platform;
    }
  }
  
  if (bestPlatform && bestScore > 0) {
    console.log(`\\n🏆 推奨プラットフォーム: ${bestPlatform.toUpperCase()} (${Math.round(bestScore * 100)}% success)`);
    console.log(`📋 Webhook URL: ${ENDPOINTS[bestPlatform]}/api/line/webhook`);
  }
  
  return summary;
}

// メイン実行
async function main() {
  try {
    const results = await runAllTests();
    const summary = generateSummary(results);
    
    // JSON形式でも出力（スクリプト連携用）
    if (process.argv.includes('--json')) {
      console.log('\\n📄 JSON Results:');
      console.log(JSON.stringify({ summary, results }, null, 2));
    }
    
    // 終了コード設定
    process.exit(summary.failed === 0 ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// スクリプト直接実行時
if (require.main === module) {
  main();
}

module.exports = { runAllTests, generateSummary };