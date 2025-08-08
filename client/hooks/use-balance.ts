import { useState, useEffect } from 'react'

export interface UserBalance {
  user_id: string
  balance_vnd: number
  created_at: string
  updated_at: string
}

// Helper function để lấy user_id từ localStorage
const getUserId = () => {
  try {
    const token = localStorage.getItem('supabase.auth.token')
    if (!token) return null
    
    const tokenData = JSON.parse(token)
    return tokenData?.currentSession?.user?.id
  } catch (error) {
    console.error('Error parsing token:', error)
    return null
  }
}

export interface Transaction {
  id: string
  user_id: string
  type: 'recharge' | 'purchase' | 'refund'
  amount_vnd: number
  description: string
  reference_id?: string
  created_at: string
}

export interface RechargeCode {
  id: string
  code: string
  amount_vnd: number
  is_used: boolean
  used_by?: string
  used_at?: string
  created_by: string
  created_at: string
  expires_at: string
}

export function useBalance() {
  const [balance, setBalance] = useState<UserBalance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
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

  const fetchBalance = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        setBalance(null)
        return
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/user_balances?select=*`, {
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
      setBalance(data[0] || null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy số dư'
      setError(errorMessage)
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const accessToken = getAccessToken()
      if (!accessToken) {
        setTransactions([])
        return
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/transaction_history?select=*&order=created_at.desc`, {
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
      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setTransactions([])
    }
  }

  const useRechargeCode = async (code: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để nạp tiền')
      }

      const userId = getUserId()
      if (!userId) {
        throw new Error('Không thể xác định người dùng')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/use_recharge_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_code: code,
          p_user_id: getUserId()
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Cập nhật số dư
        await fetchBalance()
        await fetchTransactions()
        return data
      } else {
        throw new Error(data.error || 'Có lỗi xảy ra khi sử dụng mã nạp tiền')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi nạp tiền'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const payWithBalance = async (amount: number) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thanh toán')
      }

      const userId = getUserId()
      if (!userId) {
        throw new Error('Không thể xác định người dùng')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pay_with_balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_user_id: getUserId(),
          p_amount_vnd: amount
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Cập nhật số dư
        await fetchBalance()
        await fetchTransactions()
        return data
      } else {
        throw new Error(data.error || 'Có lỗi xảy ra khi thanh toán')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thanh toán'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, [])

  return {
    balance,
    transactions,
    loading,
    error,
    useRechargeCode,
    payWithBalance,
    refetch: fetchBalance
  }
}
