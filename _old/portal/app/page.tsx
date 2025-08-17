import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatFileSize, getFileIcon } from '@/lib/file-utils'

async function getPacks() {
  const { data: packs, error } = await supabase
    .from('packs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch packs:', error)
    return []
  }

  return packs || []
}

export default async function HomePage() {
  const packs = await getPacks()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔬 研究成果特典パック
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          AI在宅ワーク研究所の研究員向けに、<br />
          実践的なツールやテンプレートを無料配布しています
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-semibold mb-2">基本パック</h3>
            <p className="text-gray-600">すべての研究員が利用可能</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm border-2 border-yellow-200">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-semibold mb-2">プレミアムパック</h3>
            <p className="text-gray-600">プレミアム研究員限定</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">成果重視</h3>
            <p className="text-gray-600">実践で使えるコンテンツ</p>
          </div>
        </div>
      </div>

      {/* Available Packs */}
      {packs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`card p-6 ${
                pack.is_premium
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getFileIcon(pack.file_url)}</div>
                <div className="flex flex-col gap-2">
                  {pack.is_premium ? (
                    <span className="badge-premium">💎 プレミアム</span>
                  ) : (
                    <span className="badge-free">🆓 無料</span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pack.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {pack.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{formatFileSize(pack.file_size)}</span>
                <span>⬇️ {pack.download_count}</span>
              </div>

              {pack.tags && pack.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {pack.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {pack.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      +{pack.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <Link
                href={`/claim?pack=${pack.id}`}
                className="block w-full text-center btn-primary"
              >
                特典を受け取る 🎁
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            特典パックを準備中
          </h3>
          <p className="text-gray-500">
            研究員の皆様向けの特典コンテンツを鋭意制作中です
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-16 bg-blue-50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">
          📋 利用方法
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              1. 特典パックを選択
            </h4>
            <p className="text-blue-700 text-sm">
              気になる特典パックの「特典を受け取る」ボタンをクリック
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              2. Discord情報で認証
            </h4>
            <p className="text-blue-700 text-sm">
              研究所メンバーかどうかの確認を行います
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              3. ダウンロードリンク取得
            </h4>
            <p className="text-blue-700 text-sm">
              認証完了後、24時間有効なダウンロードリンクが発行されます
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              4. 実践で活用
            </h4>
            <p className="text-blue-700 text-sm">
              取得した特典を研究活動で積極的に活用してください
            </p>
          </div>
        </div>
      </div>

      {/* Discord Link */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          まだ研究員になっていない方は、まずDiscordにご参加ください
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <span>💬</span>
          AI在宅ワーク研究所に参加
        </a>
      </div>
    </div>
  )
}