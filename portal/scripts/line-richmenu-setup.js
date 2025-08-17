/**
 * LINE公式アカウント リッチメニュー設定スクリプト
 * AI副業サロン用のリッチメニューを自動生成・設定します
 */

require('dotenv').config()

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN

if (!LINE_CHANNEL_ACCESS_TOKEN) {
  console.error('❌ LINE_CHANNEL_ACCESS_TOKEN が設定されていません')
  console.log('💡 .env ファイルに以下を追加してください:')
  console.log('LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token')
  process.exit(1)
}

// リッチメニュー設定
const richMenuData = {
  size: {
    width: 2500,
    height: 1686
  },
  selected: false,
  name: "AI副業サロン メインメニュー",
  chatBarText: "メニュー",
  areas: [
    {
      bounds: {
        x: 0,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://ai-salon-project.vercel.app/lead-magnets"
      }
    },
    {
      bounds: {
        x: 833,
        y: 0,
        width: 834,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://discord.gg/ai-salon"
      }
    },
    {
      bounds: {
        x: 1667,
        y: 0,
        width: 833,
        height: 843
      },
      action: {
        type: "message",
        text: "使い方"
      }
    },
    {
      bounds: {
        x: 0,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "message",
        text: "質問"
      }
    },
    {
      bounds: {
        x: 833,
        y: 843,
        width: 834,
        height: 843
      },
      action: {
        type: "message",
        text: "料金"
      }
    },
    {
      bounds: {
        x: 1667,
        y: 843,
        width: 833,
        height: 843
      },
      action: {
        type: "uri",
        uri: "https://ai-salon-project.vercel.app"
      }
    }
  ]
}

// リッチメニュー画像生成用のSVG
const generateRichMenuSVG = () => {
  return `
<svg width="2500" height="1686" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="buttonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="buttonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="2500" height="1686" fill="url(#bgGrad)"/>
  
  <!-- Grid lines -->
  <line x1="833" y1="0" x2="833" y2="1686" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="1666" y1="0" x2="1666" y2="1686" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="0" y1="843" x2="2500" y2="843" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Top Row -->
  <!-- 📚 無料ガイド受け取り -->
  <rect x="10" y="10" width="813" height="823" rx="20" fill="url(#buttonGrad1)" stroke="#1e40af" stroke-width="2"/>
  <text x="416" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">📚</text>
  <text x="416" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">無料ガイド</text>
  <text x="416" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">受け取り</text>
  <text x="416" y="640" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#ddd6fe">70,000円相当</text>
  
  <!-- 💬 Discordコミュニティ -->
  <rect x="843" y="10" width="814" height="823" rx="20" fill="url(#buttonGrad2)" stroke="#059669" stroke-width="2"/>
  <text x="1250" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">💬</text>
  <text x="1250" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="55" font-weight="bold" fill="white">Discord</text>
  <text x="1250" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="55" font-weight="bold" fill="white">コミュニティ</text>
  <text x="1250" y="640" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#a7f3d0">2,800人参加中</text>
  
  <!-- 🎯 使い方ガイド -->
  <rect x="1677" y="10" width="813" height="823" rx="20" fill="#6366f1" stroke="#4f46e5" stroke-width="2"/>
  <text x="2083" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">🎯</text>
  <text x="2083" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">使い方</text>
  <text x="2083" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">ガイド</text>
  
  <!-- Bottom Row -->
  <!-- 📞 質問・相談 -->
  <rect x="10" y="853" width="813" height="823" rx="20" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <text x="416" y="1190" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">📞</text>
  <text x="416" y="1320" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">質問・相談</text>
  <text x="416" y="1450" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#fef3c7">24時間対応</text>
  
  <!-- 💰 料金案内 -->
  <rect x="843" y="853" width="814" height="823" rx="20" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>
  <text x="1250" y="1190" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">💰</text>
  <text x="1250" y="1320" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">料金案内</text>
  <text x="1250" y="1450" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#ddd6fe">基本無料</text>
  
  <!-- 🚀 今すぐ始める -->
  <rect x="1677" y="853" width="813" height="823" rx="20" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
  <text x="2083" y="1190" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white">🚀</text>
  <text x="2083" y="1320" text-anchor="middle" font-family="Arial, sans-serif" font-size="55" font-weight="bold" fill="white">今すぐ</text>
  <text x="2083" y="1400" text-anchor="middle" font-family="Arial, sans-serif" font-size="55" font-weight="bold" fill="white">始める</text>
</svg>
  `.trim()
}

// リッチメニュー作成
async function createRichMenu() {
  console.log('🎯 LINE リッチメニューを作成中...')
  
  try {
    // 1. リッチメニュー作成
    const response = await fetch('https://api.line.me/v2/bot/richmenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(richMenuData)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`リッチメニュー作成失敗: ${error}`)
    }

    const result = await response.json()
    const richMenuId = result.richMenuId
    
    console.log('✅ リッチメニュー作成成功')
    console.log(`📋 Rich Menu ID: ${richMenuId}`)

    // 2. 画像アップロード用のSVGをBase64に変換
    const svgContent = generateRichMenuSVG()
    console.log('🎨 リッチメニュー画像を準備中...')
    
    // SVGをPNGに変換する代わりに、手動作成を案内
    console.log('\n🎨 リッチメニュー画像の設定が必要です:')
    console.log('以下の手順で画像を設定してください:\n')
    console.log('1. 2500×1686pxの画像を作成')
    console.log('2. 6つのエリアに分割:')
    console.log('   ┌──────────────┬──────────────┬──────────────┐')
    console.log('   │  📚 無料ガイド  │  💬 Discord  │  🎯 使い方   │')
    console.log('   │   受け取り     │  コミュニティ  │   ガイド     │')
    console.log('   ├──────────────┼──────────────┼──────────────┤')
    console.log('   │  📞 質問・相談  │  💰 料金案内  │  🚀 今すぐ   │')
    console.log('   │               │              │   始める     │')
    console.log('   └──────────────┴──────────────┴──────────────┘')
    console.log('\n3. LINE Official Account Manager で画像をアップロード')
    console.log('4. リッチメニューを公開設定')
    
    console.log(`\n📝 設定情報:`)
    console.log(`Rich Menu ID: ${richMenuId}`)
    console.log('Webhook URL: https://ai-salon-project.vercel.app/api/line/webhook')
    
    return richMenuId
    
  } catch (error) {
    console.error('❌ リッチメニュー作成エラー:', error.message)
    throw error
  }
}

// デフォルトリッチメニュー設定
async function setDefaultRichMenu(richMenuId) {
  console.log('🔧 デフォルトリッチメニューを設定中...')
  
  try {
    const response = await fetch(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`デフォルト設定失敗: ${error}`)
    }

    console.log('✅ デフォルトリッチメニュー設定完了')
    
  } catch (error) {
    console.error('❌ デフォルト設定エラー:', error.message)
    throw error
  }
}

// 既存のリッチメニュー一覧取得
async function listRichMenus() {
  console.log('📋 既存のリッチメニューを確認中...')
  
  try {
    const response = await fetch('https://api.line.me/v2/bot/richmenu/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`リスト取得失敗: ${error}`)
    }

    const result = await response.json()
    console.log('📋 既存のリッチメニュー:')
    result.richmenus.forEach((menu, index) => {
      console.log(`  ${index + 1}. ${menu.name} (ID: ${menu.richMenuId})`)
    })
    
    return result.richmenus
    
  } catch (error) {
    console.error('❌ リスト取得エラー:', error.message)
    return []
  }
}

// メイン実行
async function main() {
  console.log('🤖 AI副業サロン LINE リッチメニュー設定ツール')
  console.log('='.repeat(50))
  
  try {
    // 既存のリッチメニューを確認
    await listRichMenus()
    
    // 新しいリッチメニューを作成
    const richMenuId = await createRichMenu()
    
    // デフォルトに設定
    await setDefaultRichMenu(richMenuId)
    
    console.log('\n🎉 リッチメニューの設定が完了しました！')
    console.log('\n📝 次の手順:')
    console.log('1. LINE Official Account Manager にログイン')
    console.log('2. 「リッチメニュー」セクションに移動')
    console.log(`3. 作成されたメニュー (ID: ${richMenuId}) に画像をアップロード`)
    console.log('4. 公開設定を有効にする')
    console.log('\n🔧 Webhook設定も忘れずに:')
    console.log('URL: https://ai-salon-project.vercel.app/api/line/webhook')
    
  } catch (error) {
    console.error('\n❌ セットアップ失敗:', error.message)
    process.exit(1)
  }
}

// コマンドライン引数の処理
const command = process.argv[2]

if (command === 'list') {
  listRichMenus()
} else if (command === 'create') {
  main()
} else {
  console.log('🤖 AI副業サロン LINE リッチメニュー設定ツール')
  console.log('\n使用方法:')
  console.log('  node line-richmenu-setup.js create  # 新しいリッチメニューを作成')
  console.log('  node line-richmenu-setup.js list    # 既存のリッチメニューを表示')
  console.log('\n⚠️  事前に以下の環境変数を設定してください:')
  console.log('  LINE_CHANNEL_ACCESS_TOKEN=your_token_here')
}