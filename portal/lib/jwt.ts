import { SignJWT, jwtVerify } from 'jose'

// JWT Secret with production fallback
const jwtSecret = process.env.JWT_SECRET || 'ai-salon-portal-jwt-secret-2025-fallback'
const secret = new TextEncoder().encode(jwtSecret)

export interface JWTPayload {
  userId: string
  discordUserId: string
  discordUsername: string
  packId: string
  claimId: string
  expiresAt: number
  [key: string]: any
}

/**
 * Create a secure JWT token for download authorization
 */
export async function createDownloadToken(payload: Omit<JWTPayload, 'expiresAt'>): Promise<string> {
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
  
  return await new SignJWT({ 
    ...payload, 
    expiresAt 
  } as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

/**
 * Verify and decode a download token
 */
export async function verifyDownloadToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Check if token has expired
    const now = Date.now()
    const expiresAt = payload.expiresAt as number
    if (expiresAt && expiresAt < now) {
      return null
    }
    
    return payload as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Generate a unique user ID from Discord information
 */
export function generateUserId(discordUserId: string, discordUsername: string): string {
  return `discord_${discordUserId}_${discordUsername.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
}