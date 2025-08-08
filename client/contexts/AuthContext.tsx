import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  full_name?: string
  email_confirmed_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const checkUser = async () => {
    try {
      console.log('Checking user...')
      // Lấy token từ localStorage
      const token = localStorage.getItem('supabase.auth.token')
      console.log('Token from localStorage:', token ? 'exists' : 'not found')
      
      if (!token) {
        console.log('No token found, setting user to null')
        setUser(null)
        return
      }

      // Parse token để lấy access_token
      const tokenData = JSON.parse(token)
      console.log('Parsed token data:', tokenData)
      const accessToken = tokenData?.currentSession?.access_token
      console.log('Access token:', accessToken ? 'exists' : 'not found')

      if (!accessToken) {
        console.log('No access token, setting user to null')
        setUser(null)
        return
      }

      // Gọi API để lấy thông tin user
      console.log('Calling user API...')
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': supabaseAnonKey
        }
      })

      console.log('User API response status:', response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log('User data received:', userData)
        setUser({
          id: userData.id,
          email: userData.email,
          full_name: userData.user_metadata?.full_name,
          email_confirmed_at: userData.email_confirmed_at
        })
      } else {
        // Token không hợp lệ, xóa khỏi localStorage
        console.log('User API failed, removing token')
        localStorage.removeItem('supabase.auth.token')
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('Attempting to sign in:', email)

      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      console.log('Sign in response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Sign in error:', errorData)
        throw new Error(errorData.error_description || 'Đăng nhập thất bại')
      }

      const data = await response.json()
      console.log('Sign in success data:', data)
      
      // Lưu token vào localStorage
      const tokenData = {
        currentSession: data
      }
      console.log('Saving token to localStorage:', tokenData)
      localStorage.setItem('supabase.auth.token', JSON.stringify(tokenData))

      // Cập nhật user state
      const userData = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
        email_confirmed_at: data.user.email_confirmed_at
      }
      console.log('Setting user state:', userData)
      setUser(userData)
      
      // Force re-check user để đảm bảo state được cập nhật
      setTimeout(() => {
        console.log('Re-checking user after sign in...')
        checkUser()
      }, 100)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)

      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          email,
          password,
          data: {
            full_name: fullName
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || 'Đăng ký thất bại')
      }

      const data = await response.json()
      
      if (data.user && !data.user.email_confirmed_at) {
        throw new Error('Vui lòng kiểm tra email để xác nhận tài khoản')
      }

      // Nếu email đã được xác nhận, tự động đăng nhập
      if (data.user?.email_confirmed_at) {
        await signIn(email, password)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('supabase.auth.token')
      if (token) {
        const tokenData = JSON.parse(token)
        const accessToken = tokenData?.currentSession?.access_token

        if (accessToken) {
          await fetch(`${supabaseUrl}/auth/v1/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'apikey': supabaseAnonKey
            }
          })
        }
      }

      // Xóa token khỏi localStorage
      localStorage.removeItem('supabase.auth.token')
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmationEmail = async (email: string) => {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          email
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || 'Gửi email thất bại')
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resendConfirmationEmail
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
