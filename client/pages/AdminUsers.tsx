import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../hooks/use-admin'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Eye, 
  X, 
  Plus, 
  Loader2,
  User,
  BookOpen,
  Calendar,
  Shield,
  GraduationCap
} from 'lucide-react'

export default function AdminUsers() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  
  // Check admin status from profile
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin'
  const { 
    users, 
    courses, 
    userEnrollments, 
    loading, 
    error,
    fetchAllUsers, 
    fetchAllCourses, 
    fetchUserEnrollments,
    revokeEnrollment,
    grantEnrollmentDirect
  } = useAdmin()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [showEnrollments, setShowEnrollments] = useState(false)
  const [showGrantDialog, setShowGrantDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

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
      fetchAllUsers()
      fetchAllCourses()
    }
  }, [isAdmin])

  // Filter users theo search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Xem enrollments của user
  const handleViewEnrollments = async (user: any) => {
    setSelectedUser(user)
    setShowEnrollments(true)
    await fetchUserEnrollments(user.id)
  }

  // Thu hồi enrollment
  const handleRevokeEnrollment = async (enrollmentId: string, courseTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn thu hồi khóa học "${courseTitle}"?`)) {
      return
    }

    try {
      setProcessing(true)
      const result = await revokeEnrollment(enrollmentId)
      
      if (result.success) {
        toast.success(`Đã thu hồi khóa học "${courseTitle}"`)
        // Refresh enrollments
        await fetchUserEnrollments(selectedUser.id)
      } else {
        toast.error(result.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi thu hồi khóa học')
    } finally {
      setProcessing(false)
    }
  }

  // Cấp enrollment trực tiếp
  const handleGrantEnrollment = async () => {
    if (!selectedUser || !selectedCourse) {
      toast.error('Vui lòng chọn user và khóa học')
      return
    }

    try {
      setProcessing(true)
      const result = await grantEnrollmentDirect(selectedUser.id, selectedCourse)
      
      if (result.success) {
        toast.success(`Đã cấp khóa học "${result.course_title}" cho ${result.user_name}`)
        setShowGrantDialog(false)
        setSelectedCourse('')
        // Refresh enrollments
        await fetchUserEnrollments(selectedUser.id)
      } else {
        toast.error(result.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi cấp khóa học')
    } finally {
      setProcessing(false)
    }
  }

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Học viên</h1>
              <p className="text-gray-600">Xem và quản lý tất cả học viên trong hệ thống</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-sm text-gray-600">
              {users.length} học viên
            </span>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo email hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
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
                    onClick={() => fetchAllUsers()} 
                    className="mt-4"
                    variant="outline"
                  >
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy học viên nào</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.full_name || 'Chưa cập nhật tên'}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.is_admin ? "default" : "secondary"}>
                            {user.is_admin ? (
                              <>
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Học viên
                              </>
                            )}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEnrollments(user)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem khóa học
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Enrollments Dialog */}
        <Dialog open={showEnrollments} onOpenChange={setShowEnrollments}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Khóa học của {selectedUser?.full_name || selectedUser?.email}
              </DialogTitle>
              <DialogDescription>
                Quản lý khóa học của học viên này
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Grant new enrollment */}
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Cấp khóa học mới:</span>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Chọn khóa học" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title} - {course.price_vnd.toLocaleString('vi-VN')} VND
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setShowGrantDialog(true)}
                  disabled={!selectedCourse || processing}
                  size="sm"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Cấp khóa học'
                  )}
                </Button>
              </div>

              {/* Enrollments list */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
              ) : userEnrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Học viên chưa có khóa học nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userEnrollments.map((enrollment) => (
                    <Card key={enrollment.enrollment_id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {enrollment.course_title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">
                                  {enrollment.source === 'purchase' ? 'Mua' : 
                                   enrollment.source === 'admin_grant' ? 'Admin cấp' : 
                                   enrollment.source}
                                </Badge>
                                <Badge variant={enrollment.enrollment_status === 'active' ? 'default' : 'secondary'}>
                                  {enrollment.enrollment_status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDate(enrollment.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeEnrollment(enrollment.enrollment_id, enrollment.course_title)}
                            disabled={processing}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Thu hồi
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Grant Enrollment Confirmation Dialog */}
        <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận cấp khóa học</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn cấp khóa học này cho học viên?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p><strong>Học viên:</strong> {selectedUser?.full_name || selectedUser?.email}</p>
                <p><strong>Khóa học:</strong> {courses.find(c => c.id === selectedCourse)?.title}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowGrantDialog(false)}
                  disabled={processing}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleGrantEnrollment}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Xác nhận cấp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
