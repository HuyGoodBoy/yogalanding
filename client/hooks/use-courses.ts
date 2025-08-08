import { useState, useEffect } from 'react'

export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  level: string | null
  duration_weeks: number | null
  price_vnd: number
  instructor: string
  youtube_playlist_url: string | null
  status: string
  created_at: string
  updated_at: string
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    console.log('useCourses: useEffect triggered')
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      console.log('useCourses: Starting fetchCourses...')
      setLoading(true)
      setError(null)
      console.log('useCourses: Fetching courses from REST API...')

      const response = await fetch(`${supabaseUrl}/rest/v1/courses?status=eq.published&select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('useCourses: Response status:', response.status)
      console.log('useCourses: Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('useCourses: HTTP error:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('useCourses: Courses response received:', data)
      console.log('useCourses: Data type:', typeof data)
      console.log('useCourses: Data length:', data?.length)

      setCourses(data || [])
      console.log('useCourses: Courses set successfully:', data?.length || 0, 'courses')
    } catch (err) {
      console.error('useCourses: Error in fetchCourses:', err)
      console.error('useCourses: Error type:', typeof err)
      console.error('useCourses: Error instanceof Error:', err instanceof Error)
      setError(err instanceof Error ? err.message : 'Failed to fetch courses')
    } finally {
      console.log('useCourses: Setting loading to false')
      setLoading(false)
    }
  }

  async function getCourseBySlug(slug: string) {
    try {
      console.log('useCourses: Fetching course by slug:', slug)
      
      const response = await fetch(`${supabaseUrl}/rest/v1/courses?slug=eq.${slug}&select=*&limit=1`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      return data[0] || null
    } catch (err) {
      console.error('useCourses: Error in getCourseBySlug:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch course')
      return null
    }
  }

  console.log('useCourses: Current state:', { courses, loading, error })

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
    getCourseBySlug
  }
}
