import { useState, useEffect } from 'react'

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed' | 'cancelled'
  source: 'purchase' | 'subscription'
  created_at: string
  updated_at: string
  courses?: {
    id: string
    title: string
    slug: string
    price_vnd: number
  }
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
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

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        setEnrollments([])
        return
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/enrollments?select=*,courses(id,title,slug,price_vnd)&order=created_at.desc`, {
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
      setEnrollments(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy danh sách khóa học đã đăng ký'
      setError(errorMessage)
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  // Kiểm tra xem user có sở hữu khóa học không
  const isEnrolledInCourse = (courseId: string): boolean => {
    return enrollments.some(enrollment => 
      enrollment.course_id === courseId && 
      enrollment.status === 'active'
    )
  }

  // Kiểm tra xem user có sở hữu khóa học theo slug không
  const isEnrolledInCourseBySlug = (courseSlug: string): boolean => {
    return enrollments.some(enrollment => 
      enrollment.courses?.slug === courseSlug && 
      enrollment.status === 'active'
    )
  }

  useEffect(() => {
    fetchEnrollments()
  }, [])

  return {
    enrollments,
    loading,
    error,
    isEnrolledInCourse,
    isEnrolledInCourseBySlug,
    refetch: fetchEnrollments
  }
}
