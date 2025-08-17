import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'AI在宅ワーク研究所 - AIで月3万円稼ぐコミュニティ',
  description: 'AI技術を活用して月3万円の副収入を自走して稼げるコミュニティ。動画生成、ブログ運営、Kindle出版など、初心者でも実践できる具体的ノウハウを仲間と一緒に学べます。',
  keywords: ['AI副業', '月3万円', '在宅ワーク', 'AIコミュニティ', 'ChatGPT', '動画生成', 'ブログ収益化', 'Kindle出版'],
  authors: [{ name: 'AI在宅ワーク研究所' }],
  openGraph: {
    title: 'AI在宅ワーク研究所 - 誇張なしの現実的な月3万円コミュニティ',
    description: '「月100万円」の誇張情報ではなく、失敗談も含めたリアルな体験を共有する誠実なコミュニティ。フェイク情報は完全排除します。',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI在宅ワーク研究所 - 誇張なしの現実的な月3万円コミュニティ',
    description: '「月100万円」の誇張情報ではなく、失敗談も含めたリアルな体験を共有する誠実なコミュニティ。フェイク情報は完全排除します。',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <main className="min-h-screen bg-slate-50">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_300px_at_50%_-20%,rgba(99,102,241,0.12),transparent),radial-gradient(400px_200px_at_20%_20%,rgba(14,165,233,0.08),transparent),radial-gradient(500px_250px_at_80%_30%,rgba(236,72,153,0.06),transparent)]" />
          </div>
          <div className="container mx-auto px-4 py-6">
            <header className="mb-10">
              <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">🤖</span>
                  <div>
                    <div className="text-lg font-bold text-slate-900 tracking-tight">AI在宅ワーク研究所</div>
                    <div className="text-sm text-slate-600 font-medium">AIで月3万円稼ぐコミュニティ</div>
                  </div>
                </Link>
                <div className="flex items-center gap-1">
                  <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">ホーム</Link>
                  <Link href="#community" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">コミュニティ</Link>
                  <Link href="#benefits" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">参加メリット</Link>
                  <Link 
                    href="https://discord.gg/ai-salon" 
                    target="_blank"
                    className="ml-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    💬 Discordで参加
                  </Link>
                </div>
              </nav>
            </header>
            {children}
          </div>
          <Toaster />
        </main>
      </body>
    </html>
  )
}
