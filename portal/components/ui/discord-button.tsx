'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ExternalLink, Users, Zap, Heart, Star } from 'lucide-react'
import { Button } from './button'
import { useDiscordAnalytics } from '@/lib/discord-analytics'

interface DiscordButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal' | 'hero' | 'cta'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showStats?: boolean
  showIcon?: boolean
  className?: string
  children?: React.ReactNode
  inviteUrl?: string
  trackingId?: string
}

export const DiscordButton: React.FC<DiscordButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showStats = false,
  showIcon = true,
  className = '',
  children,
  inviteUrl = 'https://discord.gg/ai-salon',
  trackingId
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const analytics = useDiscordAnalytics()

  // バリアント別のスタイル設定
  const variantStyles = {
    primary: {
      base: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
      hover: 'scale-105',
      icon: 'text-white'
    },
    secondary: {
      base: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg',
      hover: 'scale-102',
      icon: 'text-white'
    },
    minimal: {
      base: 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white hover:border-white/40',
      hover: 'scale-102',
      icon: 'text-white'
    },
    hero: {
      base: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-900 shadow-2xl hover:shadow-yellow-400/25',
      hover: 'scale-105',
      icon: 'text-slate-900'
    },
    cta: {
      base: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-green-500/25',
      hover: 'scale-103',
      icon: 'text-white'
    }
  }

  // サイズ別の設定
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7'
  }

  const currentVariant = variantStyles[variant]
  const currentSize = sizeStyles[size]
  const currentIconSize = iconSizes[size]

  // クリック追跡
  const handleClick = () => {
    setClickCount(prev => prev + 1)
    
    // 分析システムにイベント送信
    if (trackingId) {
      analytics.trackClick(trackingId, {
        variant,
        size,
        clickCount: clickCount + 1,
        timestamp: new Date().toISOString(),
        url: inviteUrl
      })
    }

    // エラーハンドリング
    try {
      // Discord URLの有効性チェック
      if (!inviteUrl || !inviteUrl.includes('discord')) {
        throw new Error(`Invalid Discord URL: ${inviteUrl}`)
      }
    } catch (error) {
      analytics.trackError(trackingId || 'unknown', error as Error)
    }
  }

  return (
    <motion.div
      className="relative inline-block"
    >
      <Link href={inviteUrl} target="_blank" onClick={handleClick}>
        <motion.div
          whileHover={{ 
            scale: variant === 'minimal' ? 1.02 : 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className={`
            inline-flex items-center gap-2 rounded-full font-bold transition-all duration-300 cursor-pointer
            ${currentVariant.base}
            ${currentSize}
            ${className}
          `}
        >
          {/* アイコン */}
          {showIcon && (
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <MessageCircle className={`${currentIconSize} ${currentVariant.icon}`} />
            </motion.div>
          )}

          {/* テキストコンテンツ */}
          <span className="flex items-center gap-2">
            {children || 'Discordで参加'}
            
            {/* 外部リンクアイコン */}
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className={`h-4 w-4 ${currentVariant.icon} opacity-70`} />
            </motion.div>
          </span>

          {/* ホバー時のエフェクト */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2 -right-2"
              >
                <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  <Heart className="h-3 w-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>

      {/* 統計情報の表示 */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>2,800人が参加中</span>
            <Zap className="h-3 w-3 text-yellow-400" />
          </div>
        </motion.div>
      )}

      {/* クリック数カウンター（開発時のみ） */}
      {process.env.NODE_ENV === 'development' && clickCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {clickCount}
        </motion.div>
      )}
    </motion.div>
  )
}

// プリセットされたDiscordボタンコンポーネント
export const DiscordJoinButton = ({ className }: { className?: string }) => (
  <DiscordButton 
    variant="primary" 
    size="lg" 
    trackingId="join-button"
    className={className}
  >
    💬 Discordで参加
  </DiscordButton>
)

export const DiscordViewButton = ({ className }: { className?: string }) => (
  <DiscordButton 
    variant="minimal" 
    size="lg"
    trackingId="view-button" 
    className={className}
  >
    Discordを見てみる
  </DiscordButton>
)

export const DiscordDownloadButton = ({ className }: { className?: string }) => (
  <DiscordButton 
    variant="cta" 
    size="lg"
    trackingId="download-button"
    className={className}
  >
    Discordで無料受け取り
  </DiscordButton>
)

export const DiscordHeroButton = ({ className }: { className?: string }) => (
  <DiscordButton 
    variant="hero" 
    size="xl"
    showStats={true}
    trackingId="hero-button"
    className={className}
  >
    今すぐDiscordで無料参加
  </DiscordButton>
)

export default DiscordButton