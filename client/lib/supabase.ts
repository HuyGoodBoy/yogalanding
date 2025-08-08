import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Supabase client created successfully')

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Supabase connection test:', { data, error })
})

// Types for our database schema
export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  level: string | null
  duration_weeks: number | null
  price_vnd: number
  status: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'canceled'
  total_amount_vnd: number
  payment_provider: 'vnpay' | null
  client_return_url: string | null
  metadata: any
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  course_id: string
  quantity: number
  amount_vnd: number
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  source: 'purchase' | 'gift' | 'admin'
  status: 'active' | 'canceled'
  start_at: string
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  provider: 'vnpay'
  transaction_no: string | null
  bank_code: string | null
  pay_date: string | null
  amount_vnd: number
  status: 'pending' | 'success' | 'failed'
  signature_valid: boolean
  raw_response: any
  created_at: string
  updated_at: string
}
