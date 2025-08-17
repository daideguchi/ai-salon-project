'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Share2, BookOpen, Clock, FileText } from 'lucide-react'

interface MarkdownContent {
  title: string
  content: string
  wordCount: number
  category: string
  estimatedReadTime: number
}

function LeadMagnetViewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const path = searchParams.get('path')
  
  const [content, setContent] = useState<MarkdownContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) {
      setError('ファイルパスが指定されていません')
      setLoading(false)
      return
    }

    loadMarkdownContent(path)
  }, [path])

  const loadMarkdownContent = async (filePath: string) => {
    try {
      setLoading(true)
      
      // パスから実際のファイルシステムパスを構築
      const actualPath = filePath.replace('/lead-magnets/', '../../../lead_magnets/')
      
      // 実際の実装では、APIルートを通じてファイルを読み込む
      // 今回はサンプルコンテンツを表示
      await new Promise(resolve => setTimeout(resolve, 1000)) // Loading simulation
      
      // サンプルコンテンツ（実際の実装では動的に読み込み）
      const sampleContent = await getSampleContent(filePath)
      setContent(sampleContent)
      
    } catch (err) {
      setError('ファイルの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getSampleContent = async (filePath: string): Promise<MarkdownContent> => {
    // ファイルパスに基づいてサンプルコンテンツを返す
    const pathMap: Record<string, MarkdownContent> = {
      '/lead-magnets/01_getting_started/ai_tools_comparison_2025.md': {
        title: '[2025年決定版] Claude 3.5 vs ChatGPT-4o完全比較ガイド',
        content: `# [2025年決定版] Claude 3.5 vs ChatGPT-4o完全比較ガイド

## 📋 このガイドについて

**「どのAIツールを使えばいいかわからない」**という方のために、2025年現在最も重要な2つのAI**Claude 3.5 Sonnet**と**ChatGPT-4o**を徹底比較しました。

**実用重視**: 月3万円の副業を目指す具体的な使い分け方法を解説

## 🎯 想定読者

- AI副業を始めたい20-40代
- ChatGPTは使ったことがあるが、Claudeは初心者
- 限られた予算で最大効果を求める
- 具体的な使い分け方法を知りたい

## 🤖 基本スペック比較

### ChatGPT-4o（OpenAI）
- **料金**: 月20ドル（約3,000円）
- **特徴**: 高速処理、画像認識、音声対応
- **強み**: 汎用性、日本語対応、プラグイン豊富
- **学習データ**: 2024年4月まで

### Claude 3.5 Sonnet（Anthropic）
- **料金**: 月20ドル（約3,000円）
- **特徴**: Artifacts機能、長文処理、思考型AI
- **強み**: コード生成、文章の質、安全性
- **学習データ**: 2025年1月まで（最新）

## 💰 副業別おすすめツール

### 📝 ブログ・記事作成
**推奨**: ChatGPT-4o ⭐⭐⭐⭐⭐

ChatGPTはSEO記事生成が得意で、月100記事生成で10万円収益の実例があります。

### 🎬 動画台本・YouTube
**推奨**: Claude 3.5 Sonnet ⭐⭐⭐⭐⭐

Claudeはストーリー構成力が優秀で、Artifacts機能でリアルタイム編集が可能です。

### 💻 プログラミング・アプリ開発
**推奨**: Claude 3.5 Sonnet ⭐⭐⭐⭐⭐

コード品質が圧倒的に高く、バグが少なく、説明が丁寧です。

## 🔍 詳細機能比較

| 項目 | ChatGPT-4o | Claude 3.5 |
|------|------------|------------|
| 自然な日本語 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| SEO記事 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| コード生成 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 具体的な使い分け戦略

### Case 1: ブログ副業（月3万円目標）
**メインツール**: ChatGPT-4o
**補助ツール**: Claude 3.5 Sonnet

**ワークフロー**:
1. **ChatGPT**: SEO記事の大枠作成
2. **Claude**: 内容の質向上・専門性追加
3. **ChatGPT**: 最終調整・公開用フォーマット

### Case 2: YouTube動画（月5万円目標）
**メインツール**: Claude 3.5 Sonnet
**補助ツール**: ChatGPT-4o

**ワークフロー**:
1. **Claude**: 台本・ストーリー構成
2. **ChatGPT**: サムネイル画像（DALL-E 3）
3. **Claude**: 継続的な改善・分析

## 💡 成功のための最終アドバイス

### 初心者向け推奨フロー
1. **ChatGPT-4oから開始**（学習コストが低い）
2. **慣れたらClaude追加**（品質向上）
3. **両方使い分け**（最大効率）

### 予算別戦略
- **月3,000円**: ChatGPT-4oのみ
- **月6,000円**: ChatGPT-4o + Claude 3.5
- **月9,000円**: 上記 + 追加ツール群

---

**免責事項**: 各AIツールの性能は日々向上しており、本ガイドの比較結果は2025年8月時点のものです。実際の収益は個人の努力と市場状況により変動します。`,
        wordCount: 9700,
        category: '入門・基礎編',
        estimatedReadTime: 12
      },
      '/lead-magnets/02_specific_methods/ai_blog_guide_2025.md': {
        title: '[2025年最新版] ChatGPT×ブログで月3万円達成ガイド',
        content: `# [2025年最新版] ChatGPT×ブログで月3万円達成ガイド

## 📋 このガイドについて

ブログ経験ゼロでも**ChatGPT**を活用して**現実的な月3万円**を目指せる具体的な手順をまとめました。

**実例ベース**: 実際に月20万円達成した「ゆけむりブログ」の成功事例を参考に、初心者でも再現可能な部分を抽出

## 🎯 想定読者

- ブログを書いたことがない完全初心者
- 会社員・主婦で時間が限られている
- 月3万円の副収入を現実的に目指したい
- ChatGPTを使ってみたが活用方法がわからない

## 💰 現実的な収益目標設定

### 📊 段階別目標（conservative estimate）
- **1ヶ月目**: 月500円（記事10本、アクセス月1,000PV）
- **3ヶ月目**: 月5,000円（記事50本、アクセス月10,000PV）
- **6ヶ月目**: 月30,000円（記事100本、アクセス月50,000PV）

### 📈 収益構造の内訳
- **Googleアドセンス**: 30%（クリック収益）
- **Amazonアソシエイト**: 40%（商品紹介）
- **ASPアフィリエイト**: 30%（サービス紹介）

*※2025年の競合増加を考慮した現実的な数字です*

## 🛠️ 必要なツール・費用

### 必須ツール
1. **ChatGPT Plus**（月20ドル）- 記事作成の中核
2. **WordPress**（月500円〜）- ブログプラットフォーム
3. **レンタルサーバー**（月1,000円）- エックスサーバー推奨
4. **ドメイン**（年1,500円）- 独自ドメイン

### 推奨ツール
- **Canva Pro**（月1,200円）- アイキャッチ画像作成
- **ラッコキーワード**（月990円）- キーワード調査
- **GRC**（月500円）- 検索順位チェック

**総月額費用**: 約6,000円（初期投資として妥当）

## 📚 ジャンル選定（実例ベース）

### 初心者におすすめジャンル
✅ **ライフスタイル・便利グッズ**（競合緩め）
✅ **趣味・ホビー系**（専門性活かせる）
✅ **地域情報・グルメ**（独自性出しやすい）
✅ **子育て・教育**（体験談豊富）

### 避けた方が良いジャンル
❌ **YMYL分野**（健康・お金・安全など）
❌ **競合激戦ジャンル**（ダイエット・転職など）
❌ **トレンド依存**（芸能・時事ニュースなど）

### ChatGPTでジャンル相談
\`\`\`
私は[年代][職業]で、以下の経験・趣味があります：
[あなたの経験・趣味・得意分野を記入]

ブログで初心者でも稼ぎやすく、2025年現在でも競合が緩いジャンルを3つ提案してください。私の経験を活かせる領域で、月3万円達成の現実性も教えてください。
\`\`\`

## 🤖 ChatGPT活用法（具体的プロンプト）

### 1. キーワード調査・記事企画
\`\`\`
以下の条件で記事企画を5つ作成してください：

ジャンル：[選定したジャンル]
ターゲット：30代会社員
記事タイプ：実体験レビュー
文字数：2000-3000文字

各企画について以下を含めてください：
- タイトル案（SEOキーワード含む）
- 見出し構成（H2-H3レベル）
- 想定する読者の悩み
- 解決策・商品紹介の方向性
- 収益化ポイント
\`\`\`

### 2. 記事本文作成
\`\`\`
以下の構成で2500文字の記事を作成してください：

タイトル：[確定したタイトル]
ターゲット：[具体的なペルソナ]
目的：[商品購入/サービス申込み]

構成：
H2: 読者の悩みに共感する導入（300文字）
H2: 商品/サービスの基本情報（400文字）
H2: 実際に使ってみた感想（体験談風に、800文字）
H2: メリット・デメリット（600文字）
H2: どんな人におすすめか（200文字）
H2: お得な購入方法・まとめ（200文字）

注意点：
- 自然な日本語で読みやすく
- 体験談は具体的なエピソードを含める
- 商品の良い点だけでなく注意点も記載
- 購入を強要せず、判断材料を提供
\`\`\`

### 3. アイキャッチ画像用プロンプト
\`\`\`
以下の記事用のアイキャッチ画像を作成するためのプロンプトを英語で作成してください：

記事タイトル：[タイトル]
ジャンル：[ジャンル]
イメージ：清潔感があり、商品/サービスの魅力が伝わる
色調：暖色系、親しみやすい雰囲気
含める要素：商品画像（風）、テキストオーバーレイ可

DALL-E 3で生成するためのプロンプトを作成してください。
\`\`\`

## 📖 記事作成プロセス（Step by Step）

### ステップ1: 記事企画（週1回・2時間）
1. **キーワード調査**（30分）
   - ラッコキーワードで関連語調査
   - 競合記事の分析
   - 検索ボリューム確認

2. **記事企画作成**（30分）
   - ChatGPTで企画案生成
   - タイトル・構成の決定
   - 収益化ポイントの設定

3. **週間スケジュール作成**（30分）
   - 7記事分の企画完成
   - 執筆順序の決定
   - 必要な素材の洗い出し

### ステップ2: 記事執筆（平日毎日・1時間）
1. **ChatGPTで下書き作成**（20分）
   - 構成に沿って本文生成
   - 複数パターンで試行
   - 最適な文章を選択

2. **人間による編集・校正**（30分）
   - 体験談・感想の追加
   - 不自然な表現の修正
   - 商品リンクの挿入

3. **最終チェック・投稿**（10分）
   - 誤字脱字チェック
   - アイキャッチ画像設定
   - WordPress投稿

### ステップ3: SEO対策・改善（週1回・1時間）
1. **検索順位チェック**（20分）
   - GRCで順位確認
   - 上位表示記事の分析
   - 改善必要記事の特定

2. **記事リライト**（30分）
   - 低順位記事の改善
   - 新情報の追加
   - 内部リンク強化

3. **アクセス解析**（10分）
   - Googleアナリティクス確認
   - 人気記事の分析
   - 収益記事の最適化

## 💰 収益化戦略

### Googleアドセンス設定
\`\`\`
申請の流れ:
1. 30記事投稿後に申請
2. プライバシーポリシー設置
3. お問い合わせフォーム設置
4. 運営者情報ページ作成

最適化のコツ:
- 記事内広告: H2見出し前に配置
- サイドバー広告: 300×250サイズ
- フッター広告: レスポンシブ対応
\`\`\`

### Amazonアソシエイト活用
\`\`\`
商品選定基準:
✅ 自分が実際に使用した商品
✅ 読者の悩み解決に直結
✅ 2,000-10,000円の価格帯
✅ レビュー評価4.0以上

紹介方法:
- 商品を使った具体的体験談
- 他商品との比較表
- 購入前の注意点も記載
- Amazon以外の購入方法も提示
\`\`\`

### ASPアフィリエイト導入
\`\`\`
おすすめASP:
✅ A8.net: 案件数最多
✅ もしもアフィリエイト: Amazon・楽天統合
✅ バリューコマース: Yahoo!ショッピング対応
✅ アクセストレード: 金融・通信系強い

案件選定基準:
- 自分のジャンルとマッチ
- 成果条件が明確
- 承認率80%以上
- 報酬単価1,000円以上
\`\`\`

## 🚨 失敗回避ポイント

### よくある失敗パターン
❌ **ChatGPTの文章をそのまま使用**
✅ **必ず自分の体験・感想を追加**

❌ **収益記事ばかり書く**
✅ **価値提供記事8：収益記事2の比率**

❌ **ジャンルを頻繁に変える**
✅ **1つのジャンルを最低6ヶ月継続**

❌ **毎日投稿にこだわる**
✅ **質を重視して週3-5記事**

### 品質を保つコツ
- **実体験を必ず含める**（ChatGPTでは生成不可）
- **読者の立場で見直す**（売り込み感を減らす）
- **画像は必ずオリジナル**（著作権問題回避）
- **情報の正確性をチェック**（責任ある発信）

## 📈 3ヶ月実行プラン

### 1ヶ月目：基盤構築
- **Week1-2**: WordPress設定・デザイン調整
- **Week3-4**: 基本記事10記事投稿
- **目標**: ブログの基本形完成

### 2ヶ月目：コンテンツ拡充
- **Week5-6**: 記事数を30記事まで拡大
- **Week7-8**: アドセンス申請・SNS連携
- **目標**: 月間10,000PV達成

### 3ヶ月目：収益化強化
- **Week9-10**: アフィリエイト記事強化
- **Week11-12**: SEO改善・リライト実施
- **目標**: 月5,000円収益達成

## 💡 さらなる成長のヒント

### 記事ネタ切れ対策
- **Yahoo!知恵袋**: 読者の生の悩み収集
- **SNSトレンド**: リアルタイムニーズ把握
- **競合ブログ**: 足りない情報の発見
- **自分の日常**: 体験談ネタの宝庫

### 執筆効率向上
- **テンプレート化**: 記事構成の標準化
- **画像素材ストック**: Canvaテンプレート準備
- **SNS予約投稿**: Buffer等での自動化
- **外注化検討**: 記事添削・画像作成等

---

**免責事項**: 収益例は実際の事例を参考にしていますが、2025年の競合状況や個人差により結果は変動します。継続的な努力と改善が必要です。`,
        wordCount: 7300,
        category: '具体的手法編',
        estimatedReadTime: 9
      }
    }

    return pathMap[filePath] || {
      title: 'ガイドが見つかりません',
      content: '指定されたガイドが見つかりませんでした。',
      wordCount: 0,
      category: 'その他',
      estimatedReadTime: 0
    }
  }

  const formatContent = (content: string) => {
    // シンプルなMarkdown→HTML変換（実際の実装ではremarkやrehypeを使用推奨）
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium text-gray-700 mb-3 mt-6">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="list-disc list-inside mb-4 space-y-2">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|u|p|l])(.*$)/gm, '<p class="mb-4">$1</p>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/lead-magnets">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              リードマグネット一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lead-magnets">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              リードマグネット一覧に戻る
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{content.category}</Badge>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    {(content.wordCount / 1000).toFixed(1)}k文字
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    約{content.estimatedReadTime}分
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-2xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDFダウンロード
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  シェア
                </Button>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  ブックマーク
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(content.content) }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📚 他のリードマグネットも見る
              </h3>
              <p className="text-gray-600 mb-4">
                70,000円相当の完全セットから、あなたに必要な情報を見つけてください。
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/lead-magnets">
                  <Button>リードマグネット一覧</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">ホームに戻る</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function LeadMagnetViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    }>
      <LeadMagnetViewContent />
    </Suspense>
  )
}