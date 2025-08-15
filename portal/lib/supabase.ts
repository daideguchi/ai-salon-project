import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for type safety
export interface Pack {
  id: string
  title: string
  description: string
  download_url: string
  file_size: number
  download_count: number
  is_premium: boolean
  is_active: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  pack_id: string
  user_id: string
  discord_user_id: string
  discord_username: string
  claimed_at: string
}

export interface Download {
  id: string
  claim_id: string
  pack_id: string
  user_id: string
  downloaded_at: string
  ip_address?: string
  user_agent?: string
}