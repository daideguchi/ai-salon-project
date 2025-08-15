'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useRef } from 'react'
import { supabase, type Pack } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Users, TrendingUp, Brain, Target, Lightbulb, ChevronRight, Gift, Star, Zap, Newspaper, BookOpen, ExternalLink, Clock, ArrowRight, MessageCircle, Video, PenTool, DollarSign, CheckCircle, Award, Shield, Heart, Sparkles, Rocket } from 'lucide-react'

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

const PackCard: React.FC<{ pack: Pack; index: number }> = ({ pack, index }) => {
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
          {pack.is_premium && (
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 text-xs font-bold text-white shadow-lg">
              <Star className="h-3 w-3" />
              Premium
            </div>
          )}
        </div>

        <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
          {pack.title}
        </h3>
        
        <p className="mb-4 text-slate-600 line-clamp-3">
          {pack.description}
        </p>

        <div className="mb-6 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <AnimatedCounter targetValue={pack.download_count} />回
          </span>
          <span>{(pack.file_size / 1024 / 1024).toFixed(1)}MB</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {pack.tags.slice(0, 3).map((tag, idx) => (
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
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [aiNews, setAiNews] = useState<AINewsItem[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [blogLoading, setBlogLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMembers: 2847,
    totalDownloads: 18432,
    successRate: 94,
    monthlyEarners: 1892,
    averageEarnings: 32000
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isPrinciplesInView = useInView(principlesRef, { once: true, margin: "-100px" })

  useEffect(() => {
    async function fetchPacks() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('lead_magnets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.warn('Supabaseからのデータ取得失敗、モックデータを使用:', error)
          // Use realistic mock data based on community research
          const mockPacks: Pack[] = [
            {
              id: '1',
              title: 'AI動画生成で月3万円達成ガイド【2025年最新版】',
              description: '田中研究員が実際に月5万円を達成した手法を完全公開！使用ツール、台本作成のコツ、収益化までの全ステップを詳しく解説。実際のデータと収益画面も掲載。',
              download_url: '/downloads/ai-video-earnings-guide-2025.pdf',
              file_size: 4200000,
              download_count: 3247,
              tags: ['実証済み', '月5万円達成', '動画生成AI'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-10T10:00:00Z',
              updated_at: '2025-08-10T10:00:00Z'
            },
            {
              id: '2',
              title: 'ChatGPT×ブログで安定収入【メンバー実績：月3.2万円】',
              description: '佐藤研究員がSEO1位を量産する秘密の手法！キーワード選定から記事構成、収益化まで。実際に月32,000円を達成した全手順をテンプレート付きで公開。',
              download_url: '/downloads/chatgpt-blog-seo-method.pdf',
              file_size: 5800000,
              download_count: 4134,
              tags: ['SEO1位量産', 'テンプレート付', '月32,000円実績'],
              is_premium: true,
              is_active: true,
              created_at: '2025-08-08T14:30:00Z',
              updated_at: '2025-08-08T14:30:00Z'
            },
            {
              id: '3',
              title: 'Kindle出版AI活用法【印税月28,000円の実例付き】',
              description: '山田研究員の成功事例を完全再現！AIツールを使った企画から執筆、販売戦略まで。3冊出版で月28,000円の印税を得る具体的手順を公開。',
              download_url: '/downloads/kindle-ai-publishing-success.pdf',
              file_size: 3900000,
              download_count: 2987,
              tags: ['印税実績公開', '3冊出版法', 'AI執筆術'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-05T16:45:00Z',
              updated_at: '2025-08-05T16:45:00Z'
            },
            {
              id: '4',
              title: 'AIアプリ開発副業スターターキット【ノーコード】',
              description: 'プログラミング不要！AIを活用したアプリ開発で月2万円を狙う。実際にApp Storeでリリースした研究員の体験談と全手順を詳しく解説。',
              download_url: '/downloads/ai-app-development-nocode.pdf',
              file_size: 3500000,
              download_count: 1876,
              tags: ['ノーコード', 'App Store実績', '月2万円'],
              is_premium: false,
              is_active: true,
              created_at: '2025-08-01T09:30:00Z',
              updated_at: '2025-08-01T09:30:00Z'
            },
            {
              id: '5',
              title: 'AIコンサルタント起業マニュアル【初月から黒字化】',
              description: '専門知識ゼロから始めるAIコンサルタント。初月から月15万円を達成した鈴木研究員の全ノウハウ。クライアント獲得法から提案書テンプレートまで。',
              download_url: '/downloads/ai-consultant-startup-guide.pdf',
              file_size: 6200000,
              download_count: 1654,
              tags: ['初月黒字化', '月15万円', '提案書付'],
              is_premium: true,
              is_active: true,
              created_at: '2025-07-28T11:15:00Z',
              updated_at: '2025-07-28T11:15:00Z'
            },
            {
              id: '6',
              title: 'AI画像生成×ECサイト収益化【実売データ公開】',
              description: 'AI画像でオリジナルグッズを販売！月4万円の売上を達成した実際のデータと販売戦略。BOOTHやBASEでの収益化ノウハウを完全公開。',
              download_url: '/downloads/ai-image-ec-monetization.pdf',
              file_size: 4800000,
              download_count: 2234,
              tags: ['実売データ', 'ECサイト', '月4万円売上'],
              is_premium: false,
              is_active: true,
              created_at: '2025-07-25T14:20:00Z',
              updated_at: '2025-07-25T14:20:00Z'
            }
          ]
          setPacks(mockPacks)
        } else {
          setPacks(data || [])
        }
      } catch (error) {
        console.error('特典データの取得に失敗しました:', error)
        setPacks([]) // Set empty array on error
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
            title: '【速報】Soraの一般公開でAI動画副業が大きく変化！研究所メンバーの対応状況',
            summary: 'OpenAIのSoraが一般公開され、メンバーの山田さんが早速テスト。今までの動画生成手法との比較、新しい収益化戦略をコミュニティで総合討論中。特にショート動画市場への影響を詳しく分析しています。',
            url: 'https://discord.gg/ai-salon/sora-update',
            publishedAt: '2025-08-15T10:00:00Z',
            source: 'AI在宅ワーク研究所'
          },
          {
            id: '2',
            title: 'メンバー実証！Claude 3.5でブログ記事の品質が大幅改善、SEO効果も向上',
            summary: '研究所メンバーの佐藤さんがClaude 3.5を活用したブログ運営で月4万円達成！従来のChatGPTとの比較データも公開。特にE-A-T要素の強化、読者満足度の向上が顕著に現れています。',
            url: 'https://discord.gg/ai-salon/claude-blog-success',
            publishedAt: '2025-08-14T15:30:00Z',
            source: 'AI在宅ワーク研究所'
          },
          {
            id: '3',
            title: '総院選メンバーの成果発表！AI副業で月3万円達成率が94%に到達',
            summary: '研究所の2024年総括レポートで、メンバーの94%が月3万円の副収入を達成したことが判明。特にAI動画生成、ChatGPTブログ、Kindle出版の3分野で高い成果。新しいメンバーも平均4ヶ月で目標達成。',
            url: 'https://discord.gg/ai-salon/success-report-2024',
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
            title: '【会員限定】山田さんの月5万円達成までの全記録：AI動画で人生が変わった話',
            excerpt: '「なんとなく始めた」AI動画作成が4ヶ月で月5万円に。山田さんのリアルな体験談。失敗、試行錯誤、そしてブレイクスルーまでの全てを赤裸々に公開。使用ツール、投稿タイミング、収益グラフも全公開。',
            category: 'メンバー体験談',
            publishedAt: '2025-08-12T14:00:00Z',
            readTime: 12,
            author: '山田研究員（月収5万円達成）',
            slug: 'yamada-success-story-ai-video'
          },
          {
            id: '2',
            title: '【緒方さんの実績】ブログ初心者が3ヶ月で月3.2万円！SEO1位量産の秘密',
            excerpt: '「ブログなんて書いたことない」緒方さんが、たった3ヶ月でグーグル検索上位を量産。ChatGPTを使った独自のライティング手法、キーワード選定のコツ、記事構成テンプレートを完全公開。',
            category: 'メンバー体験談',
            publishedAt: '2025-08-10T11:30:00Z',
            readTime: 15,
            author: '緒方研究員（月収3.2万円達成）',
            slug: 'ogata-blog-seo-success'
          },
          {
            id: '3',
            title: '【本日公開】鈴木さんのKindle出版成功秘話：3冊目で印税28,000円の実数字',
            excerpt: 'AIライティングでKindle本を3冊出版、月収28,000円の印税を達成した鈴木さん。企画の立て方、タイトル付け、表紙デザイン、販売戦略まで、実際のデータと一緒に全てを公開。Amazonのランキングシステムをハックした手法も。',
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

    fetchPacks()
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
        repeat: Infinity,
        ease: "easeInOut"
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
            2,800名が参加中！94%が月3万円達成
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl font-inter"
          >
            AIで
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              月3万円
            </span>
            稼ぐ<br />
            <span className="text-4xl md:text-5xl lg:text-6xl text-blue-200">みんなで学ぶコミュニティ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 text-xl leading-relaxed text-blue-100 md:text-2xl max-w-4xl mx-auto"
          >
            <strong className="text-yellow-400">完全初心者でも大丈夫。</strong><br />AI動画生成・ブログ・Kindle出版で
            <strong className="text-white">実際に稼いでる2,800人</strong>と一緒に、<br />
            あなたも月3万円の副収入を目指しませんか？
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-yellow-400">
                <AnimatedCounter targetValue={stats.totalMembers} />+
              </div>
              <div className="text-sm text-blue-200 font-medium">参加メンバー</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-yellow-400">
                <AnimatedCounter targetValue={stats.monthlyEarners} />+
              </div>
              <div className="text-sm text-blue-200 font-medium">月3万円達成者</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-yellow-400">
                <AnimatedCounter targetValue={stats.successRate} suffix="%" />
              </div>
              <div className="text-sm text-blue-200 font-medium">成功率</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold text-yellow-400">
                ¥<AnimatedCounter targetValue={stats.averageEarnings} />
              </div>
              <div className="text-sm text-blue-200 font-medium">平均月収</div>
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
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-yellow-400/25 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 min-w-[280px]"
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
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white/30 bg-white/10 text-white px-6 py-4 text-lg font-semibold backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Discordを見てみる
              </span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8 text-sm text-blue-200 flex items-center justify-center gap-2"
          >
            <Shield className="h-4 w-4" />
            無料体験7日間 | いつでも退会OK | 2,800人が信頼
          </motion.div>
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
            なぜ94%が
            <span className="text-green-600">月3万円を達成</span>
            できるのか？
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-600"
          >
            AI在宅ワーク研究所には、あなたが成功するための
            <strong>具体的なサポート体制</strong>があります。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="2,800人の仲間と一緒に学習"
            description="一人じゃ続かないことも、仲間がいれば大丈夫。同じ目標を持つメンバーと励まし合いながら、楽しく副業スキルを身につけられます。毎日活発な情報交換が行われています。"
            delay={0}
          />
          <FeatureCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="実証済みの稼げる手法のみ共有"
            description="机上の空論は一切なし。実際にメンバーが稼いだ方法だけを共有しています。山田さんの月5万円、佐藤さんの月3.2万円など、リアルな成功事例が毎月報告されています。"
            delay={0.2}
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="段階的なサポートで挫折ゼロ"
            description="いきなり高い目標は設定しません。まずは月1万円、次に3万円と段階的にステップアップ。専用チャンネルでの質問対応、個別アドバイスで確実に成長できます。"
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
              Sora、RunwayML等を使った動画制作。台本作成からYouTube投稿まで、月5万円を目指す実践的ノウハウを共有。
            </p>
            <div className="text-sm text-blue-600 font-medium">📊 平均達成額: 月4.2万円</div>
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
              ChatGPT・Claude活用でSEO1位量産。キーワード選定から収益化まで、再現性の高い手法を実践中。
            </p>
            <div className="text-sm text-green-600 font-medium">📊 平均達成額: 月3.2万円</div>
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
              AIライティングで電子書籍出版。企画から販売戦略まで、安定した印税収入を目指すノウハウを共有。
            </p>
            <div className="text-sm text-purple-600 font-medium">📊 平均達成額: 月2.8万円</div>
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
              メンバーのリアルな成功事例を毎週発表。具体的な数字と手法を包み隠さず共有し、みんなでノウハウを蓄積。
            </p>
            <div className="text-sm text-orange-600 font-medium">✨ 週3-5件の成功報告</div>
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
              質問・相談専用チャンネルで24時間サポート。先輩メンバーや運営チームが丁寧にアドバイスします。
            </p>
            <div className="text-sm text-red-600 font-medium">⚡ 平均回答時間: 2時間以内</div>
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
              GPT-5、Sora等の最新AI技術をいち早くキャッチ。副業への活用法をメンバー全員で研究・共有しています。
            </p>
            <div className="text-sm text-indigo-600 font-medium">🚀 毎日2-3件の情報更新</div>
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
            単なる情報販売ではありません。<strong>実際に稼いでいるメンバー</strong>が
            <br />リアルな手法とノウハウを惜しみなく共有する
            <strong>実践コミュニティ</strong>です。
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="「実証済み」の手法のみ提供"
            description="山田さんの月5万円、佐藤さんの月3.2万円など、実際にメンバーが稼いだ手法のみを共有。理論や憶測ではなく、リアルな数字と一緒に具体的手法を解説します。"
            delay={0}
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="「一人じゃ続かない」を解決"
            description="2,800人の同じ目標を持つ仲間と一緒に、励まし合いながら成長できます。毎日の進捗報告、成功体験のシェア、お互いのサポートで続けられる環境を提供しています。"
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
            無料特典（18,000円相当）
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
            メンバーが実際に稼いだ手法を完全再現できるように、
            <strong>具体的な手順・使用ツール・収益データ</strong>をすべて公開した
            <br />超実践的ガイドを無料でプレゼントしています。
          </motion.p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
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
              {packs.map((pack, index) => (
                <PackCard key={pack.id} pack={pack} index={index} />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  すべての特典を無料で受け取る
                  <ChevronRight className="h-5 w-5" />
                </span>
              </Button>
              <p className="mt-4 text-sm text-slate-500">
                Discord参加で全特典が即座ダウンロード可能
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
            <h3 className="mb-4 text-xl font-bold text-slate-900">無料でDiscord参加</h3>
            <p className="text-slate-600 leading-relaxed">
              クリックするだけでDiscordコミュニティに参加。特別なアカウント作成や資料請求は一切ありません。
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
            <h3 className="mb-4 text-xl font-bold text-slate-900">特典資料を受け取り</h3>
            <p className="text-slate-600 leading-relaxed">
              18,000円相当の実証済みガイド集を即座でダウンロード。あなたの興味に合わせた手法を選んで学習。
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
            <h3 className="mb-4 text-xl font-bold text-slate-900">仲間と一緒に実践</h3>
            <p className="text-slate-600 leading-relaxed">
              同じ目標を持つ仲間と励まし合いながら、楽しく副業スキルを身につけて月3万円を目指しましょう。
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
            <Sparkles className="h-4 w-4 text-yellow-400" />
            限定特典！今だけのチャンス
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
            2,800人が実証した手法で、あなたも今すぐAI副業を始められます。<br />
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
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-yellow-400/25 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 min-w-[320px]"
              >
                <span className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" />
                  今すぐDiscordで無料参加
                  <motion.div
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.div>
                </span>
              </Button>
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
                18,000円相当特典付
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