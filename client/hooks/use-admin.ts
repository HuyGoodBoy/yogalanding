import { useState, useEffect } from 'react'

export interface AdminProfile {
  id: string
  email: string
  full_name?: string
  is_admin: boolean
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

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

  const checkAdminStatus = async () => {
    try {
      setLoading(true)
      console.log('Checking admin status...')
      
      const accessToken = getAccessToken()
      if (!accessToken) {
        console.log('No access token found')
        setIsAdmin(false)
        setAdminProfile(null)
        return
      }

      // Lấy thông tin user từ auth
      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': supabaseAnonKey
        }
      })

      if (!userResponse.ok) {
        console.log('User response not ok:', userResponse.status)
        setIsAdmin(false)
        setAdminProfile(null)
        return
      }

      const userData = await userResponse.json()
      console.log('User data:', userData)

      // Kiểm tra profile để xem có phải admin không
      const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*&id=eq.${userData.id}`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      console.log('Profile response status:', profileResponse.status)

      if (profileResponse.ok) {
        const profiles = await profileResponse.json()
        console.log('Profiles data:', profiles)
        const profile = profiles[0]
        console.log('Profile:', profile)
        
        if (profile && (profile.is_admin || profile.role === 'admin')) {
          console.log('User is admin!')
          setIsAdmin(true)
          setAdminProfile({
            id: profile.id,
            email: userData.email, // Sử dụng email từ userData
            full_name: profile.full_name,
            is_admin: profile.is_admin || profile.role === 'admin'
          })
        } else {
          console.log('User is not admin or profile not found')
          setIsAdmin(false)
          setAdminProfile(null)
        }
      } else {
        console.log('Profile response not ok')
        setIsAdmin(false)
        setAdminProfile(null)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      setAdminProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const createRechargeCode = async (amount: number) => {
    try {
      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để tạo mã nạp tiền')
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/create_recharge_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_amount_vnd: amount,
          p_created_by: adminProfile?.id
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        return data
      } else {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo mã nạp tiền')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mã nạp tiền'
      throw new Error(errorMessage)
    }
  }

  const getRechargeCodes = async () => {
    try {
      const accessToken = getAccessToken()
      if (!accessToken) {
        return []
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/recharge_codes?select=*&order=created_at.desc`, {
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
      return data || []
    } catch (err) {
      console.error('Error fetching recharge codes:', err)
      return []
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  return {
    isAdmin,
    adminProfile,
    loading,
    createRechargeCode,
    getRechargeCodes,
    refetch: checkAdminStatus
  }
}
