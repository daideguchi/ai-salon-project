'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase, Pack } from '@/lib/supabase'
import { formatFileSize, getFileIcon } from '@/lib/file-utils'

interface ClaimFormData {
  discordUserId: string
  discordUsername: string
}

export default function ClaimPage() {
  const [pack, setPack] = useState<Pack | null>(null)
  const [formData, setFormData] = useState<ClaimFormData>({
    discordUserId: '',
    discordUsername: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const packId = searchParams.get('pack')

  useEffect(() => {
    if (!packId) {
      router.push('/')
      return
    }
    
    fetchPack()
  }, [packId])

  const fetchPack = async () => {
    try {
      const { data, error } = await supabase
        .from('packs')
        .select('*')
        .eq('id', packId)
        .single()

      if (error) throw error
      
      setPack(data)
    } catch (err) {
      setError('特典パックが見つかりませんでした')
      console.error('Failed to fetch pack:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pack || !formData.discordUserId || !formData.discordUsername) {
      setError('すべての項目を入力してください')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packId: pack.id,
          discordUserId: formData.discordUserId,
          discordUsername: formData.discordUsername,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '申請に失敗しました')
      }

      // Redirect to download page with token
      router.push(`/download?token=${result.token}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '申請に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">特典パック情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            特典パックが見つかりません
          </h2>
          <p className="text-gray-600 mb-6">
            指定された特典パックが存在しないか、削除された可能性があります
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Pack Information */}
      <div className={`card p-6 mb-8 ${
        pack.is_premium
          ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
          : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getFileIcon(pack.file_url)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {pack.title}
              </h1>
              {pack.is_premium ? (
                <span className="badge-premium">💎 プレミアム</span>
              ) : (
                <span className="badge-free">🆓 無料</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{pack.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📦 {formatFileSize(pack.file_size)}</span>
              <span>⬇️ {pack.download_count} ダウンロード</span>
            </div>

            {pack.tags && pack.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {pack.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Form */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔐 認証情報の入力
        </h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Discord情報の確認方法
              </h3>
              <ol className="text-blue-800 text-sm space-y-1">
                <li>1. Discordアプリを開く</li>
                <li>2. 右下の「設定」⚙️ をタップ</li>
                <li>3. 「アカウント」を選択</li>
                <li>4. ユーザーIDをコピー（長押し → コピー）</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="discordUserId" className="block text-sm font-medium text-gray-700 mb-2">
              Discord ユーザーID *
            </label>
            <input
              type="text"
              id="discordUserId"
              required
              placeholder="例: 123456789012345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.discordUserId}
              onChange={(e) => setFormData(prev => ({ ...prev, discordUserId: e.target.value }))}
            />
            <p className="text-gray-500 text-xs mt-1">
              18桁の数字のIDです（ユーザー名ではありません）
            </p>
          </div>

          <div>
            <label htmlFor="discordUsername" className="block text-sm font-medium text-gray-700 mb-2">
              Discord ユーザー名 *
            </label>
            <input
              type="text"
              id="discordUsername"
              required
              placeholder="例: researcher_taro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.discordUsername}
              onChange={(e) => setFormData(prev => ({ ...prev, discordUsername: e.target.value }))}
            />
            <p className="text-gray-500 text-xs mt-1">
              研究所サーバーで使用しているユーザー名
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-600">❌</span>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600">⚠️</span>
              <div>
                <p className="text-yellow-800 text-sm font-medium mb-1">
                  注意事項
                </p>
                <ul className="text-yellow-700 text-xs space-y-1">
                  <li>• {pack.is_premium ? 'プレミアム研究員' : '研究員'}として登録済みである必要があります</li>
                  <li>• 入力情報が正しくない場合、認証に失敗します</li>
                  <li>• ダウンロードリンクは24時間で無効になります</li>
                  <li>• 特典は個人利用のみ可能です</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                認証中...
              </>
            ) : (
              <>🎁 特典を受け取る</>
            )}
          </button>
        </form>
      </div>

      {/* Back button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          ← 特典一覧に戻る
        </button>
      </div>
    </div>
  )
}