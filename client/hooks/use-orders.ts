import { useState } from 'react'

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

export function useOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const getAccessToken = () => {
    try {
      const token = localStorage.getItem('supabase.auth.token')
      if (!token) return null
      
      const tokenData = JSON.parse(token)
      return tokenData?.currentSession?.access_token
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  const createOrder = async (courseIds: string[], totalAmount: number) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để mua khóa học')
      }

      // Convert string IDs to UUID format
      const courseUuids = courseIds.map(id => id)

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_course_ids: courseUuids,
          p_total_amount_vnd: totalAmount
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo đơn hàng'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để xem đơn hàng')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy đơn hàng'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getOrderById = async (orderId: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để xem đơn hàng')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*,order_items(*,courses(*))`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data[0] || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy đơn hàng'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markOrderPaid = async (orderId: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_order_paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_order_id: orderId
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Handle 204 No Content response (successful update)
      if (response.status === 204) {
        return true
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật đơn hàng'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createOrder,
    getOrders,
    getOrderById,
    markOrderPaid,
    loading,
    error
  }
}
