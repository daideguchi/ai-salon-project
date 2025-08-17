import { NextRequest, NextResponse } from 'next/server'
import { verifyDownloadToken } from '@/lib/jwt'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
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

    try {
      // Record the download
      const downloadId = uuidv4()
      const userAgent = request.headers.get('user-agent') || undefined
      const forwarded = request.headers.get('x-forwarded-for')
      const realIp = request.headers.get('x-real-ip')
      const ipAddress = forwarded ? forwarded.split(',')[0] : realIp || undefined

      await supabase.from('downloads').insert([
        {
          id: downloadId,
          claim_id: payload.claimId,
          pack_id: payload.packId,
          user_id: payload.userId,
          downloaded_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      ])

      // Update download count
      await supabase.rpc('increment_download_count', {
        pack_id: payload.packId
      })

    } catch (recordError) {
      console.error('Failed to record download:', recordError)
      // Continue with download even if recording fails
    }

    try {
      // Get file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('packs')
        .download(pack.file_url)

      if (downloadError) {
        throw downloadError
      }

      if (!fileData) {
        throw new Error('File data is null')
      }

      // Create response with file
      const response = new NextResponse(fileData)
      
      // Set headers for file download
      response.headers.set('Content-Type', 'application/octet-stream')
      response.headers.set('Content-Disposition', `attachment; filename="${pack.title}"`)
      response.headers.set('Content-Length', pack.file_size.toString())
      
      return response

    } catch (downloadError) {
      console.error('File download error:', downloadError)
      
      // If Supabase storage fails, try direct URL (fallback)
      if (pack.file_url.startsWith('http')) {
        try {
          const fileResponse = await fetch(pack.file_url)
          
          if (!fileResponse.ok) {
            throw new Error(`HTTP ${fileResponse.status}`)
          }
          
          const fileData = await fileResponse.arrayBuffer()
          const response = new NextResponse(fileData)
          
          response.headers.set('Content-Type', fileResponse.headers.get('content-type') || 'application/octet-stream')
          response.headers.set('Content-Disposition', `attachment; filename="${pack.title}"`)
          response.headers.set('Content-Length', pack.file_size.toString())
          
          return response
          
        } catch (fallbackError) {
          console.error('Fallback download failed:', fallbackError)
        }
      }
      
      return NextResponse.json(
        { error: 'ファイルのダウンロードに失敗しました。しばらく時間をおいて再度お試しください。' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Download processing error:', error)
    return NextResponse.json(
      { error: 'ダウンロード処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}