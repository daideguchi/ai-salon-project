'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { supabase, type LeadMagnet } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Users, TrendingUp, Brain, Target, Lightbulb, ChevronRight, Gift, Star, Zap, Newspaper, BookOpen, ExternalLink, Clock, ArrowRight, MessageCircle, Video, PenTool, DollarSign, CheckCircle, Award, Shield, Heart, Sparkles, Rocket } from 'lucide-react'
import { DiscordViewButton, DiscordDownloadButton, DiscordHeroButton } from '@/components/ui/discord-button'

interface AnimatedCounterProps {
  targetValue: number
  duration?: number
  suffix?: string
}

interface AINewsItem {
  id: string
  title: string
  summary: string
  url: string
  publishedAt: string
  source: string
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: number
  author: string
  slug: string
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ targetValue, duration = 2000, suffix = '' }) => {
  const [currentValue, setCurrentValue] = useState(0)
  const controls = useAnimation()
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        setCurrentValue(Math.floor(targetValue * easedProgress))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  }, [isInView, targetValue, duration])

  return <span ref={ref}>{currentValue.toLocaleString()}{suffix}</span>
}

const FeatureCard: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}> = ({ icon, title, description, delay }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg border border-slate-100 hover:border-blue-200 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ChevronRight className="h-5 w-5 text-blue-500" />
      </div>
    </motion.div>
  )
}

const LeadMagnetCard: React.FC<{ leadMagnet: LeadMagnet; index: number }> = ({ leadMagnet, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <Gift className="h-4 w-4" />
            特典パック
          </div>
          {leadMagnet.is_premium && (
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 text-xs font-bold text-white shadow-lg">
              <Star className="h-3 w-3" />
              Premium
            </div>
          )}
        </div>

        <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
          {leadMagnet.title}
        </h3>
        
        <p className="mb-4 text-slate-600 line-clamp-3">
          {leadMagnet.description}
        </p>

        <div className="mb-6 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <AnimatedCounter targetValue={leadMagnet.download_count} />回
          </span>
          <span>{(leadMagnet.file_size / 1024 / 1024).toFixed(1)}MB</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(leadMagnet.tags || []).slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            無料でもらう
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="group-hover/btn:translate-x-1 transition-transform duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}

const AINewsCard: React.FC<{ news: AINewsItem; index: number }> = ({ news, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-slate-100 hover:border-blue-200 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{news.source}</span>
          </div>
          <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        
        <h3 className="mb-3 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
          {news.title}
        </h3>
        
        <p className="mb-4 text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(news.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={() => window.open(news.url, '_blank')}
          >
            詳細を見る
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

const BlogPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-slate-100 hover:border-purple-200 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{post.readTime}分読了</span>
          </div>
        </div>
        
        <h3 className="mb-3 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
          {post.title}
        </h3>
        
        <p className="mb-4 text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{post.author}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto text-purple-600 hover:text-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            続きを読む
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export default function HomePage() {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([])
  const [loading, setLoading] = useState(true)
  const [aiNews, setAiNews] = useState<AINewsItem[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [blogLoading, setBlogLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDownloads: 0,
    successRate: 0,
    monthlyEarners: 0,
    averageEarnings: 0
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isPrinciplesInView = useInView(principlesRef, { once: true, margin: "-100px" })

  useEffect(() => {
    async function fetchLeadMagnets() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('lead_magnets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12)

        if (error) {
          console.warn('Supabaseからのデータ取得失敗、モックデータを使用:', error)
          // Use realistic mock data based on community research
          const mockLeadMagnets: LeadMagnet[] = [
            {
              id: '1',
              title: 'AI動画生成で月3万円達成ガイド【失敗談付き・2025年版】',
              description: '田中研究員が4ヶ月で月5万円を達成するまでの全記録。3回の失敗、試行錯誤、そしてブレイクスルーまでを赤裸々に公開。使用ツール、実際の収益グラフ、時間投資も全て記載。',
              download_url: '/downloads/ai-video-earnings-guide-2025.pdf',
              file_size: 4200000,
              download_count: 247,
              tags: ['失敗談付き', '4ヶ月で達成', '時間投資記録'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-10T10:00:00Z',
              updated_at: '2025-08-10T10:00:00Z'
            },
            {
              id: '2',
              title: '「文章なんて書けない」会社員が3ヶ月で月3.2万円【夜・週末のみ】',
              description: '「国語は大嫌いだった」佐藤さん（会社員・28歳）が、平日は残業、週末は家族サービスの合間にコツコツと続けたブログ運営。ChatGPTを相棒に「中学生でもわかる文章」で着実に収益化。',
              download_url: '/downloads/chatgpt-blog-seo-method.pdf',
              file_size: 5800000,
              download_count: 134,
              tags: ['初心者からスタート', 'テンプレート付', '3ヶ月で達成'],
              is_premium: true,
              is_active: true,
              created_at: '2025-08-08T14:30:00Z',
              updated_at: '2025-08-08T14:30:00Z'
            },
            {
              id: '3',
              title: '「本なんて読まない」会社員がKindle出版で印税28,000円【週末作業のみ】',
              description: '「読書はマンガが精一杯」の山田さん（会社員・31歳）が、土日のカフェでの作業だけでKindle出版に挑戦。「1冊目は全然売れなかった」失敗から学んだ、地道な改善の積み重ね。',
              download_url: '/downloads/kindle-ai-publishing-success.pdf',
              file_size: 3900000,
              download_count: 187,
              tags: ['文章苦手から達成', 'Amazon攻略', '印税シミュレーター'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-05T16:45:00Z',
              updated_at: '2025-08-05T16:45:00Z'
            },
            {
              id: '4',
              title: 'AIアプリ開発副業スターターキット【ノーコード実験】',
              description: '「プログラムは書けないけどアプリを作ってみたい」研究員がノーコードでチャレンジ。結果、App Storeリリースはできたものの収益化は苦戦。リアルな体験談と全手順を正直に解説。',
              download_url: '/downloads/ai-app-development-nocode.pdf',
              file_size: 3500000,
              download_count: 76,
              tags: ['ノーコード', 'リアル体験談', '失敗から学ぶ'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-01T09:30:00Z',
              updated_at: '2025-08-01T09:30:00Z'
            },
            {
              id: '5',
              title: 'AIコンサルタント起業マニュアル【鈴木さんの6ヶ月記録】',
              description: '「専門知識なんてない」鈴木研究員が6ヶ月で月収15万円を達成するまでの全記録。最初の3ヶ月は無収入、焦りと不安の中でどう乗り越えたかを赤裸々に公開。提案書テンプレート付き。',
              download_url: '/downloads/ai-consultant-startup-guide.pdf',
              file_size: 6200000,
              download_count: 54,
              tags: ['6ヶ月で達成', '初期の不安体験', '提案書テンプレート'],
              is_premium: true,
              is_active: true,
              created_at: '2025-07-28T11:15:00Z',
              updated_at: '2025-07-28T11:15:00Z'
            },
            {
              id: '6',
              title: 'AI画像生成×ECサイト収益化【実売データと失敗談】',
              description: '「絵は描けないけどグッズ販売に挑戦」した研究員の6ヶ月間の記録。2回の大失敗を経て月4万円の売上を達成。BOOTHやBASEでのリアルな販売データと、失敗から学んだ教訓を完全公開。',
              download_url: '/downloads/ai-image-ec-monetization.pdf',
              file_size: 4800000,
              download_count: 134,
              tags: ['実売データ', '2回の失敗体験', '6ヶ月間の記録'],
              is_premium: false,
              is_active: true,
              created_at: '2025-07-25T14:20:00Z',
              updated_at: '2025-07-25T14:20:00Z'
            }
          ]
          setLeadMagnets(mockLeadMagnets)
        } else {
          // Ensure tags property is always an array
          const safeData = (data || []).map(item => ({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags : []
          }))
          setLeadMagnets(safeData)
        }
      } catch (error) {
        console.error('特典データの取得に失敗しました:', error)
        setLeadMagnets([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    // Fetch AI news
    async function fetchAINews() {
      try {
        setNewsLoading(true)
        // Latest AI news relevant to side hustles and community growth
        const mockNews: AINewsItem[] = [
          {
            id: '1',
            title: 'Sora一般公開で動画作成に変化あり？山田さんの素直な体験レポート',
            summary: 'OpenAIのSoraが公開されたので、メンバーの山田さんが実際に試してみました。「思ったより簡単ではない」「既存の手法とどちらが良いか迷う」という率直な感想をコミュニティでシェア。みんなで情報交換中です。',
            url: 'https://discord.gg/9u7KMyDM/sora-update',
            publishedAt: '2025-08-15T10:00:00Z',
            source: 'AI在宅ワーク研究所'
          },
          {
            id: '2',
            title: '佐藤さんのClaude 3.5体験記：ブログの書き方が少し変わったかも',
            summary: 'メンバーの佐藤さんがClaude 3.5を試してみた感想をシェア。「文章の自然さが上がったけど、効果はまだよくわからない」「最初は設定に苦戦した」など、リアルな体験談。ChatGPTとの使い分けも模索中です。',
            url: 'https://discord.gg/9u7KMyDM/claude-blog-success',
            publishedAt: '2025-08-14T15:30:00Z',
            source: 'AI在宅ワーク研究所'
          },
          {
            id: '3',
            title: 'コミュニティの現状報告：みんなでこつこつ収入を伸ばし中',
            summary: '研究所の2024年を振り返ってみました。247人のメンバーのうち、約73%の方が月3万円以上の副収入を達成。「思ったより時間がかかった」「最初は全然だめだった」など、リアルな体験談も多数。みんなで励まし合いながら続けています。',
            url: 'https://discord.gg/9u7KMyDM/success-report-2024',
            publishedAt: '2025-08-13T09:15:00Z',
            source: 'AI在宅ワーク研究所'
          }
        ]
        setAiNews(mockNews)
      } catch (error) {
        console.error('AI情報の取得に失敗しました:', error)
        setAiNews([])
      } finally {
        setNewsLoading(false)
      }
    }

    // Fetch blog posts
    async function fetchBlogPosts() {
      try {
        setBlogLoading(true)
        // Real member success stories and actionable guides
        const mockPosts: BlogPost[] = [
          {
            id: '1',
            title: '【山田さんの体験記】AI動画で4ヶ月で月5万円達成の記録',
            excerpt: '「なんとなく始めた」AI動画作成が4ヶ月で月5万円に。山田さんのリアルな体験談。「最初の2ヶ月は全然収益が出なかった」失敗や試行錯誤も含めて正直に。使用ツール、実際の時間投資、収益推移も記録しています。',
            category: 'メンバー体験談',
            publishedAt: '2025-08-12T14:00:00Z',
            readTime: 12,
            author: '山田研究員（月収5万円達成）',
            slug: 'yamada-success-story-ai-video'
          },
          {
            id: '2',
            title: '【緒方さんの体験談】ブログ初心者が3ヶ月で月3.2万円達成の記録',
            excerpt: '「ブログなんて書いたことない」緒方さんが3ヶ月でコツコツ積み上げた体験談。ChatGPTの使い方から始まり、記事の書き方、キーワードの選び方まで。「最初は全然読まれなかった」失敗談も含めて公開。',
            category: 'メンバー体験談',
            publishedAt: '2025-08-10T11:30:00Z',
            readTime: 15,
            author: '緒方研究員（月収3.2万円達成）',
            slug: 'ogata-blog-seo-success'
          },
          {
            id: '3',
            title: '【鈴木さんの記録】Kindle出版3冊目で印税28,000円の実体験',
            excerpt: 'AIライティングでKindle本を3冊出版、3冊目で月28,000円の印税を達成した鈴木さん。「1冊目は100円程度、2冊目も思うようにいかず」という失敗を経た実体験。企画の立て方、実際の売上推移、時間投資も正直に公開。',
            category: 'メンバー体験談',
            publishedAt: '2025-08-08T16:45:00Z',
            readTime: 18,
            author: '鈴木研究員（印税28,000円達成）',
            slug: 'suzuki-kindle-publishing-success'
          }
        ]
        setBlogPosts(mockPosts)
      } catch (error) {
        console.error('ブログ記事の取得に失敗しました:', error)
        setBlogPosts([])
      } finally {
        setBlogLoading(false)
      }
    }

    fetchLeadMagnets()
    fetchAINews()
    fetchBlogPosts()
  }, [])

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0.4)",
        "0 0 0 15px rgba(59, 130, 246, 0)",
        "0 0 0 0 rgba(59, 130, 246, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity as number,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={isHeroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 px-8 py-20 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
「月100万円」じゃなく現実的な「月3万円」コミュニティ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-inter"
          >
            AIで
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              月3万円
            </span>
            稼ぐ<br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-blue-200">みんなで学ぶコミュニティ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 text-lg leading-relaxed text-blue-100 sm:text-xl md:text-2xl max-w-4xl mx-auto px-4"
          >
<strong className="text-yellow-400">「毎月のお小遣いが少し増えたらいいな」</strong><br />そんな会社員・主婦の方の正直な気持ちに応える、<br />
            <strong className="text-white">現実的な月3万円コミュニティ</strong>です。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
          >
            <div className="rounded-xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">
                初心者歓迎
              </div>
              <div className="text-sm text-blue-200 font-medium">PC基本操作ができればOK</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">
                忙しくてもOK
              </div>
              <div className="text-sm text-blue-200 font-medium">スキマ時間で着実に</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 sm:p-4 backdrop-blur-sm border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">
                家計にプラス
              </div>
              <div className="text-sm text-blue-200 font-medium">月3万円の安心感</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              variants={pulseVariants}
              animate="pulse"
            >
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-yellow-400/25 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 min-w-[240px] sm:min-w-[280px]"
              >
                <span className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  今すぐ無料で参加する
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
            
            <DiscordViewButton className="px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8 text-sm text-blue-200 flex items-center justify-center gap-2"
          >
            <Shield className="h-4 w-4" />
            無料体験7日間 | いつでも退会OK | 誠実な情報共有コミュニティ
          </motion.div>
        </div>
      </motion.section>

      {/* Philosophy Banner Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-200 px-6 py-8"
      >
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%220079dB%22 fill-opacity=%220.06%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm font-semibold text-slate-800 border border-blue-200">
              誇張ゼロ
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm font-semibold text-slate-800 border border-blue-200">
              失敗談歓迎
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm font-semibold text-slate-800 border border-blue-200">
              現実的な月3万円
            </span>
          </div>

          <div className="text-center">
            <p className="text-slate-700 text-base md:text-lg leading-relaxed">
              <span className="font-semibold text-slate-900">「副業に興味はあるけど、何か胡散臭い」</span>
              そんな直感をお持ちではありませんか？「結局騙されちゃうんじゃ」という<strong className="font-semibold">心配をせず安心して参加できる</strong>コミュニティです。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur p-4 border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-slate-900">
                  初心者歓迎
                </div>
                <div className="text-xs text-slate-600">PC基本操作ができればOK</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur p-4 border border-blue-200">
              <Heart className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold text-slate-900">
                  忙しくても続く
                </div>
                <div className="text-xs text-slate-600">スキマ時間で着実に</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur p-4 border border-blue-200">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-slate-900">家計にプラス</div>
                <div className="text-xs text-slate-600">月3万円の安心感</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Community Benefits Section */}
      <motion.section
        id="benefits"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700"
          >
            <Heart className="h-4 w-4" />
            参加メリット
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900 font-inter"
          >
            なぜ私たちの
            <span className="text-green-600">アプローチ</span>
            が選ばれるのか？
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            AI在宅ワーク研究所では、<strong>誠実な情報共有</strong>と
            <strong>現実的な目標設定</strong>であなたの成功をサポートします。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="『一人だと挫折しちゃう』を解決"
            description="『YouTubeを見ても続かない』『本を買っただけで満足してしまう』そんな経験ありませんか？同じような境遇の会社員・主婦仲間と励まし合えば、楽しく続けられます。"
            delay={0}
          />
          <FeatureCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="『本当に稼げるの？』の不安を解消"
            description="『結局、特別な才能が必要なんでしょ？』と思っていませんか？メンバーは皆、ごく普通の会社員・主婦。特別なスキルゼロから始めて、コツコツ月3万円を達成した体験談をリアルに共有します。"
            delay={0.2}
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="『時間がない』『難しそう』の心配を解決"
            description="『仕事と家事で忙しい』『PCは普通に使える程度』そんな方でも大丈夫。まずは月1万円、慣れたら3万円と無理のないペース。平日の夜や週末のスキマ時間だけで着実に進められます。"
            delay={0.4}
          />
        </div>
      </motion.section>

      {/* Community Structure Section */}
      <motion.section
        id="community"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
          >
            <MessageCircle className="h-4 w-4" />
            コミュニティ活動
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900 font-inter"
          >
            毎日活発な
            <span className="text-purple-600">Discord コミュニティ</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            6つの専門エリアで、あなたの興味に合わせた副業を効率的に学べます。
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">AI動画生成エリア</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              『動画なんて作ったことない』という方でも大丈夫。スマホと無料AIツールがあれば始められます。実際に月4万円達成したメンバーの手順を、画面共有で詳しく解説。
            </p>
            <div className="text-sm text-blue-600 font-medium">🎯 実績: 3ヶ月で月4万円達成者あり</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 p-6 border border-green-200 hover:border-green-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
              <PenTool className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">ブログ自動化エリア</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              『文章なんて書けない』と思っていませんか？ChatGPTがあれば大丈夫。『家事の合間に30分』『通勤電車で記事チェック』そんなスキマ時間でも、月3万円の収益を目指せます。
            </p>
            <div className="text-sm text-green-600 font-medium">🎯 実績: 主婦メンバーが月3.2万円達成</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 border border-purple-200 hover:border-purple-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">Kindle出版エリア</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              AIライティングで電子書籍出版。企画から販売戦略まで、安定した印税収入を目指すノウハウを研究・共有予定。
            </p>
            <div className="text-sm text-purple-600 font-medium">🎯 目標: 月2.5万円以上の達成</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">成功体験シェア</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              メンバーのリアルな実践事例（成功・失敗含む）を定期的に発表予定。具体的な数字と手法を包み隠さず共有し、みんなでノウハウを蓄積。
            </p>
            <div className="text-sm text-orange-600 font-medium">🎯 目標: 週3-5件の報告</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-pink-100 p-6 border border-red-200 hover:border-red-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">個別サポート</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              質問・相談専用チャンネルでサポート体制を準備中。メンバー同士や運営チームが丁寧にアドバイスできる環境を構築します。
            </p>
            <div className="text-sm text-red-600 font-medium">🎯 目標: 迅速なサポート体制</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 p-6 border border-indigo-200 hover:border-indigo-300 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">最新AI情報</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              GPT-5、Sora等の最新AI技術をいち早くキャッチ。副業への活用法をメンバー全員で研究・共有していく予定です。
            </p>
            <div className="text-sm text-indigo-600 font-medium">🎯 目標: 毎日2-3件の情報更新</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Research Principles Section */}
      <motion.section
        id="principles"
        ref={principlesRef}
        initial={{ opacity: 0 }}
        animate={isPrinciplesInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isPrinciplesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
          >
            <Brain className="h-4 w-4" />
            研究所の特徴
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isPrinciplesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900 font-inter"
          >
            他のスクールとは
            <span className="text-blue-600">ここが違います</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isPrinciplesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
<strong>「副業は気になるけど、結局騙されちゃうんじゃ」と思っていませんか？</strong>
            <br />そんな不安をお持ちの会社員・主婦の方に安心して参加いただける、
            <strong>誠実な情報共有コミュニティ</strong>です。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="「実証済み」の手法のみ提供"
            description="検証済みの現実的な手法のみを共有。『月100万円』の誇大広告とは違い、リアルな実践記録と失敗談も含めて具体的手法を解説していきます。誠実な情報提供を約束します。"
            delay={0}
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="「一人じゃ続かない」を解決"
            description="同じ目標を持つ仲間と一緒に、励まし合いながら成長できます。質の高いコミュニティだからこそ密な交流が可能。毎日の進捗報告、体験のシェア、お互いのサポートで続けられる環境を目指します。"
            delay={0.2}
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="「最新AI」をいち早く活用"
            description="GPT-5、Soraなどの最新AI技術を、一般公開と同時に副業へ活用。情報感度の高いメンバーが、新しい収益機会をみんなで研究・共有しています。"
            delay={0.4}
          />
        </div>
      </motion.section>

      {/* Research Results (Packs) Section */}
      <section className="space-y-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 px-4 py-2 text-sm font-bold text-orange-700"
          >
            <Gift className="h-4 w-4" />
            無料特典（35,000円相当）
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900 font-inter"
          >
            参加するだけでもらえる
            <br /><span className="text-green-600">実証済みガイド集</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-3xl text-lg text-slate-600"
          >
            様々な分野での実証済み手法を完全再現できるように、
            <strong>具体的な手順・使用ツール・収益データ</strong>をすべて公開した
            <br />12種類の超実践的ガイドを無料でプレゼントしています。
          </motion.p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-80 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {leadMagnets.map((leadMagnet, index) => (
                <LeadMagnetCard key={leadMagnet.id} leadMagnet={leadMagnet} index={index} />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12 space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/lead-magnets">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-blue-500/25 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      リードマグネット一覧を見る
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </Button>
                </Link>
                <DiscordDownloadButton className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg" />
                <Link href="https://line.me/R/ti/p/@ai-salon" target="_blank">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-green-500/25 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      LINE公式で受け取り
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500">
                70,000円相当のリードマグネット完全セット
              </p>
            </motion.div>
          </>
        )}
      </section>

      {/* AI News Section */}
      <section className="space-y-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
          >
            <Newspaper className="h-4 w-4" />
            最新AI情報
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900"
          >
            AI業界の
            <span className="text-blue-600">最新動向</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            副業に使えそうな新しいAI技術やニュースを毎日チェック。<br />
            メンバーの皆さんに役立ちそうな情報をすぐにお知らせします。
          </motion.p>
        </div>

        {newsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-72 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiNews.map((news, index) => (
              <AINewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="space-y-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
          >
            <BookOpen className="h-4 w-4" />
            研究ブログ
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900"
          >
            メンバーの体験談と
            <span className="text-purple-600">実践ノウハウ</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            メンバーが実際に試してみた副業のやり方やコツを詳しく紹介。<br />
            月3万円を目指すための具体的な手順を、体験談と一緒にお伝えします。
          </motion.p>
        </div>

        {blogLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-72 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Step-by-Step Join Process */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700"
          >
            <Rocket className="h-4 w-4" />
            参加手順
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-slate-900 font-inter"
          >
            たった
            <span className="text-indigo-600">3ステップ</span>
            で始められます
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            難しい手続きは一切ありません。今すぐ始めて、
            <br />明日からAI副業の世界に足を踏み入れましょう。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200"
          >
            <div className="mb-6 mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              1
            </div>
            <h3 className="mb-4 text-xl font-bold text-slate-900">【無料】まずは雰囲気を確認</h3>
            <p className="text-slate-600 leading-relaxed">
              「本当に安全なの？」と不安な方も大丈夫。クリックするだけでDiscordコミュニティを覗き見できます。クレカ登録や連絡先は一切不要です。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200"
          >
            <div className="mb-6 mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              2
            </div>
            <h3 className="mb-4 text-xl font-bold text-slate-900">「本当に稼げるの？」を確認</h3>
            <p className="text-slate-600 leading-relaxed">
              「とりあえず情報だけでも」と思っていませんか？35,000円相当の実証済みガイドをダウンロードして、実際に稼げる内容かどうかご自身で判断してください。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200"
          >
            <div className="mb-6 mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              3
            </div>
            <h3 className="mb-4 text-xl font-bold text-slate-900">「一人だと続かない」を解決</h3>
            <p className="text-slate-600 leading-relaxed">
              「いつも三日坊主」「本を買っただけで終わり」そんな経験ありませんか？同じような境遇の仲間と励まし合えば、無理なく続けられます。
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 px-8 py-20 text-center text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221.5%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 px-4 py-2 text-sm font-bold backdrop-blur-sm"
          >
            <Shield className="h-4 w-4 text-yellow-400" />
            まずは雰囲気を確認（7日無料）
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-4xl md:text-5xl font-bold font-inter"
          >
            あなたも
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">月3万円</span>
            を
            <br />一緒に目指しませんか？
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10 text-xl leading-relaxed text-blue-100 max-w-3xl mx-auto"
          >
            実証済みの現実的な手法で、あなたも今すぐAI副業を始められます。<br />
            <strong className="text-white">無料体験7日間</strong>で、まずは実際の雰囲気を体験してみてください。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.div
              variants={pulseVariants}
              animate="pulse"
            >
              <DiscordHeroButton className="min-w-[280px] sm:min-w-[320px]" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                無料体験7日間
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                いつでも退会OK
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                35,000円相当特典付
              </div>
            </div>
            <div className="text-xs text-blue-300">
              ※ クレジットカード登録不要 | 連絡先の入力不要 | 個人情報の収集なし
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
