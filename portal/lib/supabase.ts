import { createClient } from '@supabase/supabase-js'

// Environment variables with fallback for build-time errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfuuybvyunfbuvsfogid.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdXV5YnZ5dW5mYnV2c2ZvZ2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA0MjcsImV4cCI6MjA3MDc3NjQyN30.fyW-2YSKbdGfIlPO1H0yJUaDtwJKGK68h7Kfv7hKpsY'

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for type safety
export interface LeadMagnet {
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

export interface Subscriber {
  id: string
  email: string
  name?: string
  discord_user_id?: string
  discord_username?: string
  email_verified: boolean
  subscription_status: string
  created_at: string
  updated_at: string
}

export interface Download {
  id: string
  subscriber_id: string
  lead_magnet_id: string
  ip_address?: string
  user_agent?: string
  downloaded_at: string
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  sender_email: string
  sender_name: string
  status: string
  scheduled_at?: string
  created_at: string
  updated_at: string
}

export interface CampaignSend {
  id: string
  campaign_id: string
  subscriber_id: string
  email_address: string
  sent_at: string
  opened_at?: string
  clicked_at?: string
  status: string
}

// Legacy Pack interface for backward compatibility
export interface Pack extends LeadMagnet {}