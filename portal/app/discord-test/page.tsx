'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DiscordButton, 
  DiscordJoinButton, 
  DiscordViewButton, 
  DiscordDownloadButton, 
  DiscordHeroButton 
} from '@/components/ui/discord-button'
import { useDiscordAnalytics } from '@/lib/discord-analytics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Zap, 
  Users, 
  MousePointer, 
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export default function DiscordTestPage() {
  const analytics = useDiscordAnalytics()
  const [stats, setStats] = useState(analytics.getStats())
  const [isTestMode, setIsTestMode] = useState(true)

  // 統計情報を定期的に更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(analytics.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [analytics])

  // テストボタンのサンプル
  const testButtons = [
    {
      component: <DiscordJoinButton className="m-2" />,
      name: 'Join Button (Primary)',
      description: 'ヘッダーで使用される基本ボタン'
    },
    {
      component: <DiscordViewButton className="m-2" />,
      name: 'View Button (Minimal)',
      description: 'Hero Sectionで使用される透明ボタン'
    },
    {
      component: <DiscordDownloadButton className="m-2" />,
      name: 'Download Button (CTA)',
      description: 'リードマグネットで使用されるCTAボタン'
    },
    {
      component: <DiscordHeroButton className="m-2" />,
      name: 'Hero Button (Hero)',
      description: 'メインCTAで使用される目立つボタン'
    }
  ]

  // カスタムテストボタン
  const customVariants = [
    { variant: 'primary' as const, name: 'Primary', color: 'bg-indigo-500' },
    { variant: 'secondary' as const, name: 'Secondary', color: 'bg-blue-500' },
    { variant: 'minimal' as const, name: 'Minimal', color: 'bg-gray-500' },
    { variant: 'hero' as const, name: 'Hero', color: 'bg-yellow-500' },
    { variant: 'cta' as const, name: 'CTA', color: 'bg-green-500' }
  ]

  const sizes = [
    { size: 'sm' as const, name: 'Small' },
    { size: 'md' as const, name: 'Medium' },
    { size: 'lg' as const, name: 'Large' },
    { size: 'xl' as const, name: 'X-Large' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900"
          >
            🎯 Discord ボタン統合テスト
          </motion.h1>
          <p className="text-xl text-gray-600">
            すべてのDiscordボタンの機能確認と分析データの表示
          </p>
          
          {/* テストモード切り替え */}
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">テストモード:</span>
            <Button
              variant={isTestMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTestMode(!isTestMode)}
            >
              {isTestMode ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {/* 統計ダッシュボード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MousePointer className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">総クリック数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">ユニークセッション</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">コンバージョン率</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">エラー率</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.errorRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* プリセットボタンテスト */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              プリセットボタンテスト
            </CardTitle>
            <CardDescription>
              実際にウェブサイトで使用されているDiscordボタンの機能確認
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testButtons.map((button, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg bg-white/50"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <h3 className="font-semibold text-gray-900">{button.name}</h3>
                    <p className="text-sm text-gray-600">{button.description}</p>
                    {button.component}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* カスタムボタンテスト */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              バリアント・サイズテスト
            </CardTitle>
            <CardDescription>
              すべてのボタンバリアントとサイズの組み合わせテスト
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* バリアント別テスト */}
              <div>
                <h3 className="text-lg font-semibold mb-4">バリアント別テスト</h3>
                <div className="flex flex-wrap gap-4">
                  {customVariants.map((variant) => (
                    <div key={variant.variant} className="text-center space-y-2">
                      <Badge className={variant.color}>{variant.name}</Badge>
                      <div>
                        <DiscordButton
                          variant={variant.variant}
                          trackingId={`test-${variant.variant}`}
                          className="m-1"
                        >
                          {variant.name}
                        </DiscordButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* サイズ別テスト */}
              <div>
                <h3 className="text-lg font-semibold mb-4">サイズ別テスト</h3>
                <div className="flex flex-wrap items-end gap-4">
                  {sizes.map((size) => (
                    <div key={size.size} className="text-center space-y-2">
                      <Badge variant="outline">{size.name}</Badge>
                      <div>
                        <DiscordButton
                          size={size.size}
                          trackingId={`test-size-${size.size}`}
                          className="m-1"
                        >
                          {size.name}
                        </DiscordButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 人気ボタンランキング */}
        {stats.popularButtons.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                人気ボタンランキング
              </CardTitle>
              <CardDescription>
                クリック数の多いボタンランキング
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularButtons.slice(0, 5).map((button, index) => (
                  <div key={button.buttonId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <span className="font-medium">{button.buttonId}</span>
                    </div>
                    <Badge variant="secondary">{button.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 制御パネル */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              制御パネル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => analytics.logStats()}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                コンソールで統計確認
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const report = analytics.exportReport()
                  const blob = new Blob([report], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `discord-analytics-${new Date().toISOString().split('T')[0]}.json`
                  a.click()
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                レポートダウンロード
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('すべての分析データをリセットしますか？')) {
                    analytics.reset()
                    setStats(analytics.getStats())
                  }
                }}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                データリセット
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* テスト結果サマリー */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Discord ボタン統合テスト完了
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-green-800 mb-2">✅ 実装完了機能</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 5種類のボタンバリアント実装</li>
                  <li>• 4つのサイズオプション</li>
                  <li>• リアルタイム分析システム</li>
                  <li>• エラーハンドリング機能</li>
                  <li>• クリック追跡・統計</li>
                  <li>• アニメーション効果</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">🎯 次のステップ</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 実際のDiscordサーバー作成</li>
                  <li>• 招待URLの更新</li>
                  <li>• 本番環境でのテスト</li>
                  <li>• ユーザーフィードバック収集</li>
                  <li>• 継続的な改善・最適化</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}