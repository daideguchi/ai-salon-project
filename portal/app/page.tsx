import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatFileSize, getFileIcon } from '@/lib/file-utils'

// モックデータ（Supabaseテーブルがない場合の代替）
const mockPacks = [
  {
    id: 'ai-video-starter-kit-2025',
    title: '🎬 AI動画作成スターターキット',
    description: '1週間で初投稿、90日で月3万円を目指すAI動画作成の完全ガイド。台本テンプレート、編集チェックリスト、収益化モデルまで全て含む実践的キット。',
    file_url: '../lead_magnets/1_ai_video_starter_kit.html',
    file_size: 147000,
    download_count: 0,
    is_premium: false,
    tags: ['AI動画', '台本テンプレート', '7日間計画', '収益化', 'YouTube'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kindle-master-guide-2025',
    title: '📚 Kindle出版完全攻略ガイド',
    description: '30日で初出版を実現するKindle出版の全ステップ。ジャンル選定からKDP運用まで、AI活用による時短術も含む完全マニュアル。',
    file_url: '../lead_magnets/2_kindle_master_guide.html',
    file_size: 132000,
    download_count: 0,
    is_premium: false,
    tags: ['Kindle出版', 'KDP', 'AI活用', '30日計画', '電子書籍'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'blog-templates-collection-2025',
    title: '📝 ブログ収益化テンプレート集',
    description: '月1万円までの最短ルートをテンプレート化。記事構成10種、SEOチェックリスト、アフィリエイト導線設計シートの完全セット。',
    file_url: '../lead_magnets/3_blog_templates/templates.md',
    file_size: 89000,
    download_count: 0,
    is_premium: false,
    tags: ['ブログ', 'SEO', 'アフィリエイト', 'テンプレート', '収益化'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ai-prompts-sidebusiness-50-2025',
    title: '🤖 AIプロンプト集（副業特化50選）',
    description: '動画・ブログ・Kindle・アプリ開発で即使える実用プロンプト50選。コピペで土台が完成、迷う時間を大幅削減。',
    file_url: '../lead_magnets/4_prompts_50/prompts.md',
    file_size: 76000,
    download_count: 0,
    is_premium: false,
    tags: ['AIプロンプト', 'ChatGPT', '副業', '50選', 'テンプレート'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'roadmap-90days-30k-2025',
    title: '🎯 月3万円達成90日ロードマップ',
    description: '継続の仕組み化で迷いゼロ前進。日別アクション、週次・月次目標、進捗管理表で確実に月3万円を達成。',
    file_url: '../lead_magnets/5_90day_roadmap/roadmap.md',
    file_size: 95000,
    download_count: 0,
    is_premium: false,
    tags: ['90日計画', '月3万円', 'ロードマップ', '目標管理', '副業'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'time-management-sidebusiness-2025',
    title: '⏰ 副業時間管理術',
    description: '週10時間で本業と両立する時間管理術。習慣化・自動化・燃え尽き防止の実践的メソッド。',
    file_url: '../lead_magnets/6_time_management/guide.md',
    file_size: 64000,
    download_count: 0,
    is_premium: true,
    tags: ['時間管理', '習慣化', '自動化', '両立術', 'プレミアム'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

async function getPacks() {
  try {
    const { data: packs, error } = await supabase
      .from('packs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch packs from Supabase, using mock data:', error)
      return mockPacks
    }

    return packs && packs.length > 0 ? packs : mockPacks
  } catch (error) {
    console.error('Supabase connection failed, using mock data:', error)
    return mockPacks
  }
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