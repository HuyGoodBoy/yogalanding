import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface AdminUser {
  id: string
  email: string
  full_name: string
  created_at: string
  is_admin: boolean
  role: string
}

export interface UserEnrollment {
  enrollment_id: string
  course_id: string
  course_title: string
  course_slug: string
  enrollment_status: string
  source: string
  start_at: string
  created_at: string
}

export interface AdminCourse {
  id: string
  title: string
  slug: string
  price_vnd: number
  instructor: string
  status: string
  created_at: string
}

export function useAdmin() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [userEnrollments, setUserEnrollments] = useState<UserEnrollment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Check if current user is admin
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin'

  // Helper function để lấy access token
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

  // Lấy danh sách tất cả users
  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/get_all_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách users'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách tất cả courses
  const fetchAllCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/get_all_courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setCourses(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách courses'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Lấy enrollments của user cụ thể
  const fetchUserEnrollments = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/get_user_enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_user_id: userId
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setUserEnrollments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải enrollments'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Thu hồi enrollment
  const revokeEnrollment = async (enrollmentId: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/revoke_enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_enrollment_id: enrollmentId
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thu hồi enrollment'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cấp enrollment trực tiếp
  const grantEnrollmentDirect = async (userId: string, courseId: string) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/grant_enrollment_direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_user_id: userId,
          p_course_id: courseId
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cấp enrollment'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Tạo mã nạp tiền
  const createRechargeCode = async (amount: number) => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      if (!user?.id) {
        throw new Error('Không thể xác định người dùng')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_recharge_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_amount_vnd: amount,
          p_created_by: user.id
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mã nạp tiền'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách mã nạp tiền
  const getRechargeCodes = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/recharge_codes?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
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
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách mã nạp tiền'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    isAdmin,
    adminProfile: profile,
    users,
    courses,
    userEnrollments,
    loading,
    error,
    fetchAllUsers,
    fetchAllCourses,
    fetchUserEnrollments,
    revokeEnrollment,
    grantEnrollmentDirect,
    createRechargeCode,
    getRechargeCodes
  }
}
