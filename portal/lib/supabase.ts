import { createClient } from '@supabase/supabase-js'

// Environment variables with fallback for build-time errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfuuybvyunfbuvsfogid.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXV5YnZ5dW5mYnV2c2ZvZ2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTQ2MzQsImV4cCI6MjA0OTc3MDYzNH0.hGZVaX3zKp4JGr0LUW9j5mGRDCIGZ7xf8_QEafHsHqw'

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

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