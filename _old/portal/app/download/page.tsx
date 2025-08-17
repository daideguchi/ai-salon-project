'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { formatFileSize, getFileIcon } from '@/lib/file-utils'

interface DownloadInfo {
  packId: string
  packTitle: string
  packDescription: string
  fileUrl: string
  fileSize: number
  isPremium: boolean
  expiresAt: number
  claimId: string
}

export default function DownloadPage() {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }
    
    verifyToken()
  }, [token])

  // Timer for expiration
  useEffect(() => {
    if (!downloadInfo) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = downloadInfo.expiresAt - now
      
      if (remaining <= 0) {
        setTimeRemaining('期限切れ')
        return
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
      
      setTimeRemaining(`${hours}時間${minutes}分${seconds}秒`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [downloadInfo])

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/verify-token?token=${token}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'トークンの検証に失敗しました')
      }

      setDownloadInfo(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'トークンの検証に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!token) return

    try {
      // Track download and get secure URL
      const response = await fetch(`/api/download?token=${token}`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('ダウンロードの開始に失敗しました')
      }

      // Get the download URL from response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = downloadInfo?.packTitle || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'ダウンロードに失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ダウンロードリンクを検証中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            アクセスエラー
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full btn-primary"
            >
              特典一覧に戻る
            </button>
            <p className="text-sm text-gray-500">
              問題が続く場合は、研究所サーバーでご報告ください
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!downloadInfo) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ダウンロードリンクが無効です
          </h2>
          <p className="text-gray-600 mb-6">
            ダウンロードリンクの有効期限が切れているか、無効なリンクです
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            新しい特典を申請する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🎉</span>
          <h2 className="text-2xl font-bold text-green-900">
            認証成功！
          </h2>
        </div>
        <p className="text-green-800">
          特典パックのダウンロード準備が完了しました。<br />
          下記のボタンからダウンロードしてください。
        </p>
      </div>

      {/* Pack Information */}
      <div className={`card p-6 mb-8 ${
        downloadInfo.isPremium
          ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
          : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getFileIcon(downloadInfo.fileUrl)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {downloadInfo.packTitle}
              </h1>
              {downloadInfo.isPremium ? (
                <span className="badge-premium">💎 プレミアム</span>
              ) : (
                <span className="badge-free">🆓 無料</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{downloadInfo.packDescription}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📦 {formatFileSize(downloadInfo.fileSize)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="card p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⬇️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ダウンロード準備完了
          </h3>
          
          {timeRemaining !== '期限切れ' ? (
            <div>
              <p className="text-gray-600 mb-4">
                ダウンロードリンクの有効期限: <span className="font-semibold text-blue-600">{timeRemaining}</span>
              </p>
              <button
                onClick={handleDownload}
                className="btn-primary text-lg px-8 py-4"
              >
                🎁 {downloadInfo.packTitle} をダウンロード
              </button>
              <p className="text-sm text-gray-500 mt-4">
                ファイルサイズ: {formatFileSize(downloadInfo.fileSize)}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-red-600 font-semibold mb-4">
                ダウンロードリンクの有効期限が切れました
              </p>
              <button
                onClick={() => router.push(`/claim?pack=${downloadInfo.packId}`)}
                className="btn-secondary"
              >
                再申請する
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 p-6 rounded-xl mt-8">
        <h4 className="font-bold text-blue-900 mb-3">📋 利用上の注意</h4>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• ダウンロードした特典は個人利用のみ可能です</li>
          <li>• 再配布・転売は禁止されています</li>
          <li>• 質問や不明点は研究所サーバーでご相談ください</li>
          <li>• 特典を活用した成果はぜひ #成果報告 でシェアしてください！</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-8 text-center space-y-4">
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          ← 他の特典も見る
        </button>
        <div className="text-sm text-gray-500">
          <p>🔬 AI在宅ワーク研究所の研究活動を応援しています</p>
        </div>
      </div>
    </div>
  )
}