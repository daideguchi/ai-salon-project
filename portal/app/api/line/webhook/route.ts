import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// LINE Bot API types
interface LineEvent {
  type: string
  message?: {
    type: string
    text?: string
  }
  source: {
    type: string
    userId: string
  }
  replyToken: string
  timestamp: number
}

interface LineWebhookBody {
  events: LineEvent[]
  destination: string
}

// Verify LINE signature
function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET
  if (!channelSecret) {
    console.error('LINE_CHANNEL_SECRET is not set')
    return false
  }

  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64')

  return signature === hash
}

// Send reply message to LINE
async function replyMessage(replyToken: string, messages: any[]) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
  if (!accessToken) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN is not set')
    return
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        replyToken,
        messages
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('LINE API Error:', error)
    }
  } catch (error) {
    console.error('Failed to send reply:', error)
  }
}

// Process text message and generate appropriate response
function processMessage(text: string): any[] {
  const lowerText = text.toLowerCase()

  // リードマグネット関連
  if (lowerText.includes('ガイド') || lowerText.includes('リードマグネット') || lowerText.includes('特典')) {
    return [{
      type: 'text',
      text: '📚 70,000円相当のリードマグネット完全セットはこちら！\n\n🔗 受け取りURL: https://ai-salon-project.vercel.app/lead-magnets\n\n✅ 完全無料\n✅ 25個のガイド\n✅ 2025年最新版\n\n🎯 初心者は「入門・基礎編」から始めることをお勧めします！'
    }]
  }

  // Discord関連
  if (lowerText.includes('discord') || lowerText.includes('ディスコード') || lowerText.includes('コミュニティ')) {
    return [{
      type: 'text',
      text: '💬 Discordコミュニティはこちら！\n\n🔗 参加URL: https://discord.gg/ai-salon\n\n👥 2,800人の仲間と一緒に学べます\n✅ 無料参加OK\n✅ 24時間質問可能\n✅ 成功事例の共有\n\n🚀 今すぐ参加して、AI副業を始めましょう！'
    }]
  }

  // 料金関連
  if (lowerText.includes('料金') || lowerText.includes('費用') || lowerText.includes('価格') || lowerText.includes('お金')) {
    return [{
      type: 'text',
      text: '💰 料金について\n\n✅ コミュニティ参加: 完全無料\n✅ リードマグネット: 完全無料\n✅ 有料プラン: 月480円（プレミアム機能）\n\n📚 まずは無料でお試しください！\n\n🎯 無料でも十分に月3万円を目指せる内容をご提供しています。'
    }]
  }

  // 始め方関連
  if (lowerText.includes('始め方') || lowerText.includes('方法') || lowerText.includes('手順') || lowerText.includes('やり方')) {
    return [{
      type: 'text',
      text: '🚀 AI副業の始め方\n\n1️⃣ リードマグネットで基礎学習\n2️⃣ Discordコミュニティに参加\n3️⃣ 興味のある手法を1つ選択\n4️⃣ 実践・改善を繰り返し\n\n📖 詳しいロードマップも無料配布中！\n\n🎯 「ChatGPT×ブログ」から始める方が多いです。'
    }]
  }

  // 使い方関連
  if (lowerText.includes('使い方') || lowerText.includes('利用方法')) {
    return [{
      type: 'text',
      text: '🎯 AI在宅ワーク研究所の使い方\n\n📚 ステップ1：リードマグネット受け取り\n👇 下のメニューから「無料ガイド受け取り」をタップ\n\n💬 ステップ2：コミュニティ参加\n👇 Discordで仲間と情報交換\n\n🚀 ステップ3：実践開始\n👇 好きな手法を1つ選んで開始\n\n📈 ステップ4：継続・改善\n👇 月3万円達成まで仲間と励まし合い\n\n❓ 分からないことがあれば、いつでも質問してください！'
    }]
  }

  // 質問関連
  if (lowerText.includes('質問') || lowerText.includes('相談') || lowerText.includes('わからない') || lowerText.includes('困った')) {
    return [{
      type: 'text',
      text: '📞 質問・相談について\n\n💬 Discordコミュニティでの質問がおすすめです：\n🔗 https://discord.gg/ai-salon\n\n【よくある質問】\n❓ 初心者でも大丈夫？ → はい！中学生でもわかる内容です\n❓ 本当に月3万円稼げる？ → 94%の方が達成（継続が前提）\n❓ どの手法がおすすめ？ → ブログ副業が始めやすいです\n❓ 時間はどのくらい必要？ → 週5-10時間程度\n\n🤝 仲間がいるので、一人で悩まず質問してくださいね！'
    }]
  }

  // デフォルトメッセージ
  return [{
    type: 'text',
    text: '🤖 AI在宅ワーク研究所です！\n\nご質問をお聞かせください。以下のキーワードで詳しい情報をお送りできます：\n\n📚「ガイド」→ リードマグネット受け取り\n💬「Discord」→ コミュニティ参加\n💰「料金」→ 料金案内\n🚀「始め方」→ スタートガイド\n❓「質問」→ サポート案内\n\n👇 または下のメニューからお選びください！'
  }]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-line-signature')

    if (!signature) {
      console.error('No LINE signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.error('Invalid LINE signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const webhookBody: LineWebhookBody = JSON.parse(body)

    // Process each event
    for (const event of webhookBody.events) {
      console.log('Processing LINE event:', event.type, event.source.userId)

      if (event.type === 'message' && event.message?.type === 'text') {
        const messageText = event.message.text || ''
        console.log('Received message:', messageText)

        // Generate response based on message content
        const replyMessages = processMessage(messageText)
        
        // Send reply
        await replyMessage(event.replyToken, replyMessages)
      } else if (event.type === 'follow') {
        // New follower - send welcome message
        const welcomeMessages = [{
          type: 'text',
          text: '🤖 AI在宅ワーク研究所へようこそ！\n\nAI技術を活用して月3万円の副収入を目指すコミュニティです。\n\n📚 70,000円相当のリードマグネット完全セットを無料プレゼント中！\n\n🎯 まずは下記のメニューから「無料ガイド受け取り」をタップしてください。\n\n⚠️ 誇張なし・現実的な手法のみをお伝えしています。'
        }]
        
        await replyMessage(event.replyToken, welcomeMessages)
      }
    }

    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    console.error('LINE webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET method for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'LINE Webhook endpoint is running' })
}