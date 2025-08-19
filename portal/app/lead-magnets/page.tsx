'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Download, Eye, FileText, Users, TrendingUp, Brain, Settings, Rocket, MessageCircle } from 'lucide-react'
import { DiscordDownloadButton } from '@/components/ui/discord-button'

interface LeadMagnet {
  id: string
  title: string
  description: string
  wordCount: number
  category: string
  categoryIcon: React.ReactNode
  categoryColor: string
  path: string
  tags: string[]
}

const leadMagnets: LeadMagnet[] = [
  // 01_getting_started
  {
    id: 'ai-tools-comparison',
    title: 'Claude 3.5 vs ChatGPT-4o完全比較ガイド',
    description: 'AI副業で稼ぐための最適ツール選択術。2025年版最新比較で効率化を実現。',
    wordCount: 9700,
    category: '入門・基礎編',
    categoryIcon: <Rocket className="h-4 w-4" />,
    categoryColor: 'bg-blue-500',
    path: '/lead-magnets/01_getting_started/ai_tools_comparison_2025.md',
    tags: ['初心者向け', 'ツール選択', '効率化']
  },
  
  // 02_specific_methods
  {
    id: 'ai-blog-guide',
    title: 'ChatGPT×ブログで月3万円達成ガイド',
    description: 'ブログ副業の具体的手順。SEO対策からマネタイズまで実践的に解説。',
    wordCount: 7300,
    category: '具体的手法編',
    categoryIcon: <FileText className="h-4 w-4" />,
    categoryColor: 'bg-green-500',
    path: '/lead-magnets/02_specific_methods/ai_blog_guide_2025.md',
    tags: ['ブログ', 'マネタイズ', 'SEO']
  },
  {
    id: 'ai-video-creation',
    title: 'Sora活用動画制作・YouTube台本作成完全ガイド',
    description: 'AI動画制作の完全マニュアル。Soraからマネタイズまで6ヶ月で月3万円。',
    wordCount: 9200,
    category: '具体的手法編',
    categoryIcon: <FileText className="h-4 w-4" />,
    categoryColor: 'bg-green-500',
    path: '/lead-magnets/02_specific_methods/ai_video_creation_guide.md',
    tags: ['動画制作', 'YouTube', 'Sora']
  },
  {
    id: 'ai-video-creation-2025',
    title: 'AI動画制作で月3万円達成ガイド2025年版',
    description: '最新ツール網羅！Runway Gen-3・Pika・Luma活用。マルチプラットフォーム対応で収益最大化。',
    wordCount: 19000,
    category: '具体的手法編',
    categoryIcon: <FileText className="h-4 w-4" />,
    categoryColor: 'bg-green-500',
    path: '/lead-magnets/02_specific_methods/ai_video_creation_guide_2025.md',
    tags: ['動画制作2025', 'Runway', 'YouTube Shorts', 'TikTok']
  },
  {
    id: 'kindle-publishing',
    title: 'AI×Kindle出版で月3万円達成ガイド',
    description: 'ChatGPT活用で文章力ゼロでもKindle出版。現実的な収益化戦略。',
    wordCount: 8700,
    category: '具体的手法編',
    categoryIcon: <FileText className="h-4 w-4" />,
    categoryColor: 'bg-green-500',
    path: '/lead-magnets/02_specific_methods/kindle_publishing_guide_2025.md',
    tags: ['Kindle出版', '電子書籍', '印税収入']
  },
  {
    id: 'ai-consulting',
    title: 'AI知識ゼロから始めるAIコンサル副業ガイド',
    description: '3ヶ月でAIコンサルタントとして月3万円。高度な知識不要の実践的アプローチ。',
    wordCount: 11600,
    category: '具体的手法編',
    categoryIcon: <FileText className="h-4 w-4" />,
    categoryColor: 'bg-green-500',
    path: '/lead-magnets/02_specific_methods/ai_consulting_guide_2025.md',
    tags: ['コンサルティング', '高単価', 'B2B']
  },

  // 03_tools_and_templates
  {
    id: 'time-management',
    title: 'AI副業時間管理術',
    description: '本業両立で月3万円達成する効率化システム。1日2時間でも結果を出す方法。',
    wordCount: 13500,
    category: 'ツール・テンプレート編',
    categoryIcon: <Settings className="h-4 w-4" />,
    categoryColor: 'bg-purple-500',
    path: '/lead-magnets/03_tools_and_templates/advanced_time_management.md',
    tags: ['時間管理', '効率化', '本業両立']
  },

  // 04_mindset_and_support
  {
    id: 'failure-prevention',
    title: 'AI副業失敗回避ガイド',
    description: '初心者が絶対に避けるべき15の落とし穴。90%が陥る失敗パターンを事前回避。',
    wordCount: 12800,
    category: 'マインドセット・サポート編',
    categoryIcon: <Brain className="h-4 w-4" />,
    categoryColor: 'bg-orange-500',
    path: '/lead-magnets/04_mindset_and_support/failure_prevention_guide.md',
    tags: ['失敗回避', 'リスク管理', '初心者向け']
  },
  {
    id: 'mental-motivation',
    title: 'AI副業メンタル管理術',
    description: '挫折せずに月3万円達成する心理戦略。継続できる人と挫折する人の違い。',
    wordCount: 14200,
    category: 'マインドセット・サポート編',
    categoryIcon: <Brain className="h-4 w-4" />,
    categoryColor: 'bg-orange-500',
    path: '/lead-magnets/04_mindset_and_support/mental_motivation_guide.md',
    tags: ['メンタル管理', 'モチベーション', '継続力']
  },

  // 05_scaling_and_advanced
  {
    id: 'scale-up-strategy',
    title: 'AI副業収益スケールアップ戦略',
    description: '月3万円から月50万円への成長ロードマップ。5段階の収益拡大モデル。',
    wordCount: 15800,
    category: 'スケール・上級編',
    categoryIcon: <TrendingUp className="h-4 w-4" />,
    categoryColor: 'bg-red-500',
    path: '/lead-magnets/05_scaling_and_advanced/scale_up_strategy.md',
    tags: ['スケールアップ', '収益拡大', '上級者向け']
  },
  {
    id: 'legal-tax-guide',
    title: 'AI副業の税務・法務完全ガイド',
    description: '初心者でもわかる安全な稼ぎ方。知らないでは済まされない法的・税務知識。',
    wordCount: 13400,
    category: 'スケール・上級編',
    categoryIcon: <TrendingUp className="h-4 w-4" />,
    categoryColor: 'bg-red-500',
    path: '/lead-magnets/05_scaling_and_advanced/legal_tax_guide.md',
    tags: ['税務', '法務', 'コンプライアンス']
  },
  {
    id: 'nft-sidebusiness-2025',
    title: 'NFT副業で月3万円達成 2025年完全ガイド',
    description: 'AI画像生成×NFT販売の実践手順。Midjourney・OpenSea活用で初心者でも30日で収益化。',
    wordCount: 19200,
    category: 'スケール・上級編',
    categoryIcon: <TrendingUp className="h-4 w-4" />,
    categoryColor: 'bg-red-500',
    path: '/lead-magnets/05_scaling_and_advanced/nft_sidebusiness_2025_complete_guide.md',
    tags: ['NFT', 'AI画像生成', 'OpenSea', 'デジタルアート']
  }
]

const categories = [
  { name: '入門・基礎編', icon: <Rocket className="h-5 w-5" />, color: 'bg-blue-500', count: 1 },
  { name: '具体的手法編', icon: <FileText className="h-5 w-5" />, color: 'bg-green-500', count: 5 },
  { name: 'ツール・テンプレート編', icon: <Settings className="h-5 w-5" />, color: 'bg-purple-500', count: 1 },
  { name: 'マインドセット・サポート編', icon: <Brain className="h-5 w-5" />, color: 'bg-orange-500', count: 2 },
  { name: 'スケール・上級編', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-red-500', count: 3 }
]

export default function LeadMagnetsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredMagnets, setFilteredMagnets] = useState<LeadMagnet[]>(leadMagnets)

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMagnets(leadMagnets)
    } else {
      setFilteredMagnets(leadMagnets.filter(magnet => magnet.category === selectedCategory))
    }
  }, [selectedCategory])

  const totalWordCount = leadMagnets.reduce((sum, magnet) => sum + magnet.wordCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 AI副業リードマグネット完全セット
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            総価値70,000円相当 • {leadMagnets.length}個のガイド • 約{(totalWordCount / 1000).toFixed(0)}k文字
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              フェイク情報完全排除
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              月3万円現実目標
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              2025年最新版
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">カテゴリ別閲覧</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-2"
            >
              すべて ({leadMagnets.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Lead Magnets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMagnets.map((magnet) => (
            <Card key={magnet.id} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    className={`${magnet.categoryColor} text-white flex items-center gap-1`}
                  >
                    {magnet.categoryIcon}
                    {magnet.category}
                  </Badge>
                  <Badge variant="outline">
                    {(magnet.wordCount / 1000).toFixed(1)}k文字
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{magnet.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {magnet.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {magnet.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/lead-magnets/view?path=${encodeURIComponent(magnet.path)}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      閲覧
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      DL
                    </Button>
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[200px]">
                      <div className="p-2 space-y-1">
                        <div className="w-full">
                          <DiscordDownloadButton className="w-full text-sm px-2 py-1" />
                        </div>
                        <Link href="https://line.me/R/ti/p/@ai-salon" target="_blank">
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                            LINE公式で受け取り
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 利用方法</h3>
          <p className="text-gray-600 mb-4">
            初心者は「入門・基礎編」から始めて、興味のある手法を「具体的手法編」で学び、
            「ツール・テンプレート」で実践、「マインドセット」で継続力を身につけ、
            成果が出たら「スケール・上級編」で拡大戦略を学んでください。
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">管理画面</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}