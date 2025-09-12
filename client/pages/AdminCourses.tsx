import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../hooks/use-admin'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Edit, 
  Eye, 
  Loader2,
  DollarSign,
  Calendar,
  User,
  Plus,
  Trash2
} from 'lucide-react'

export default function AdminCourses() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  
  // Check admin status from profile
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin'
  
  const { 
    courses, 
    loading, 
    error,
    fetchAllCourses
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/')
      return
    }
  }, [user, isAdmin, navigate])

  // Load data khi component mount
  useEffect(() => {
    if (isAdmin) {
      fetchAllCourses()
    }
  }, [isAdmin])

  // Filter courses theo search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Xóa khóa học
  const deleteCourse = async (courseId: string) => {
    try {
      setDeletingCourseId(courseId)
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      // Get access token
      const token = localStorage.getItem('supabase.auth.token')
      if (!token) {
        throw new Error('Không thể xác thực')
      }
      
      const tokenData = JSON.parse(token)
      const accessToken = tokenData?.currentSession?.access_token

      const response = await fetch(`${supabaseUrl}/rest/v1/courses?id=eq.${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        let errorMessage = 'Có lỗi xảy ra khi xóa khóa học'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      toast.success('Xóa khóa học thành công!')
      // Refresh danh sách khóa học
      fetchAllCourses()
      
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa khóa học')
    } finally {
      setDeletingCourseId(null)
      setShowDeleteConfirm(null)
    }
  }

  // Xác nhận xóa
  const confirmDelete = (courseId: string) => {
    setShowDeleteConfirm(courseId)
  }

  // Hủy xóa
  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
              <p className="text-gray-600">Xem và quản lý tất cả khóa học trong hệ thống</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-sm text-gray-600">
              {courses.length} khóa học
            </span>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, slug hoặc giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Create New Course Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/create-course')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo khóa học mới
          </Button>
        </div>

        {/* Courses List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <p>{error}</p>
                  <Button 
                    onClick={() => fetchAllCourses()} 
                    className="mt-4"
                    variant="outline"
                  >
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy khóa học nào</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">Slug: {course.slug}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={course.status === 'published' ? "default" : "secondary"}>
                            {course.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(course.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatCurrency(course.price_vnd)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {course.instructor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/course/${course.slug}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/create-course?edit=${course.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(course.id)}
                        disabled={deletingCourseId === course.id}
                      >
                        {deletingCourseId === course.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-red-600">Xác nhận xóa khóa học</CardTitle>
                <CardDescription>
                  Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={cancelDelete}
                    disabled={deletingCourseId === showDeleteConfirm}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteCourse(showDeleteConfirm)}
                    disabled={deletingCourseId === showDeleteConfirm}
                  >
                    {deletingCourseId === showDeleteConfirm ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa khóa học
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
