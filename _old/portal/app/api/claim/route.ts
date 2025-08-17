import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createDownloadToken, generateUserId } from '@/lib/jwt'
import { getDiscordUserInfo, sendClaimNotification } from '@/lib/discord'
import { v4 as uuidv4 } from 'uuid'

interface ClaimRequest {
  packId: string
  discordUserId: string
  discordUsername: string
}

export async function POST(request: NextRequest) {
  try {
    const { packId, discordUserId, discordUsername }: ClaimRequest = await request.json()

    // Validate input
    if (!packId || !discordUserId || !discordUsername) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      )
    }

    // Get pack information
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .select('*')
      .eq('id', packId)
      .single()

    if (packError || !pack) {
      return NextResponse.json(
        { error: '指定された特典パックが見つかりません' },
        { status: 404 }
      )
    }

    // Verify Discord user and membership
    const discordUser = await getDiscordUserInfo(discordUserId)
    
    if (!discordUser) {
      return NextResponse.json(
        { error: 'Discord情報の確認に失敗しました。ユーザーIDが正しいか確認してください。' },
        { status: 401 }
      )
    }

    // Check username match (case-insensitive)
    if (discordUser.username.toLowerCase() !== discordUsername.toLowerCase()) {
      return NextResponse.json(
        { error: 'Discord ユーザー名が一致しません。正しい情報を入力してください。' },
        { status: 401 }
      )
    }

    // Check premium membership for premium packs
    if (pack.is_premium && !discordUser.isPremium) {
      return NextResponse.json(
        { error: 'このパックはプレミアム研究員限定です。プレミアムプランにアップグレードしてください。' },
        { status: 403 }
      )
    }

    // Check if already claimed (prevent duplicate claims)
    const userId = generateUserId(discordUserId, discordUsername)
    const { data: existingClaim } = await supabase
      .from('claims')
      .select('*')
      .eq('pack_id', packId)
      .eq('user_id', userId)
      .single()

    let claimId: string

    if (existingClaim) {
      // Use existing claim
      claimId = existingClaim.id
    } else {
      // Create new claim
      claimId = uuidv4()
      const { error: claimError } = await supabase
        .from('claims')
        .insert([
          {
            id: claimId,
            pack_id: packId,
            user_id: userId,
            discord_user_id: discordUserId,
            discord_username: discordUsername,
            claimed_at: new Date().toISOString(),
          },
        ])

      if (claimError) {
        console.error('Failed to create claim:', claimError)
        return NextResponse.json(
          { error: '申請の記録に失敗しました。再度お試しください。' },
          { status: 500 }
        )
      }

      // Send notification to Discord (non-blocking)
      sendClaimNotification(discordUserId, pack.title).catch(err =>
        console.error('Failed to send claim notification:', err)
      )
    }

    // Create secure download token
    const token = await createDownloadToken({
      userId,
      discordUserId,
      discordUsername,
      packId,
      claimId,
    })

    return NextResponse.json({
      success: true,
      token,
      message: '認証が成功しました。ダウンロードページに移動しています...',
    })

  } catch (error) {
    console.error('Claim processing error:', error)
    return NextResponse.json(
      { error: '申請処理中にエラーが発生しました。再度お試しください。' },
      { status: 500 }
    )
  }
}