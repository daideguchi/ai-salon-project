import { NextRequest, NextResponse } from 'next/server'
import { verifyDownloadToken } from '@/lib/jwt'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'トークンが指定されていません' },
        { status: 400 }
      )
    }

    // Verify JWT token
    const payload = await verifyDownloadToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'トークンが無効または期限切れです' },
        { status: 401 }
      )
    }

    // Get pack information
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .select('*')
      .eq('id', payload.packId)
      .single()

    if (packError || !pack) {
      return NextResponse.json(
        { error: '特典パックが見つかりません' },
        { status: 404 }
      )
    }

    // Verify claim still exists
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', payload.claimId)
      .single()

    if (claimError || !claim) {
      return NextResponse.json(
        { error: '申請記録が見つかりません' },
        { status: 404 }
      )
    }

    // Return download information
    return NextResponse.json({
      packId: pack.id,
      packTitle: pack.title,
      packDescription: pack.description,
      fileUrl: pack.file_url,
      fileSize: pack.file_size,
      isPremium: pack.is_premium,
      expiresAt: payload.expiresAt,
      claimId: claim.id,
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'トークンの検証中にエラーが発生しました' },
      { status: 500 }
    )
  }
}