import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI在宅ワーク研究所 - 特典ポータル',
  description: 'AI在宅ワーク研究所の研究員向け特典配布ポータル',
  keywords: ['AI', '副業', '在宅ワーク', '研究所', 'ChatGPT'],
  authors: [{ name: 'AI在宅ワーク研究所' }],
  openGraph: {
    title: 'AI在宅ワーク研究所 - 特典ポータル',
    description: '月3万円の副収入を目指す研究員向け特典配布システム',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🏛️ AI在宅ワーク研究所
              </h1>
              <p className="text-xl text-gray-600">
                特典配布ポータル 🎁
              </p>
              <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                研究員専用システム
              </div>
            </header>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}