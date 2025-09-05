import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEnrollments } from '../hooks/use-enrollments'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { ArrowLeft, BookOpen, Play, Clock, Award, CheckCircle, Star, Users, Calendar } from 'lucide-react'

export default function MyCourses() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enrollments, loading } = useEnrollments()
  
  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Tính progress giả định (có thể thay bằng data thật sau)
  const getCourseProgress = (courseId: string) => {
    // Giả định progress dựa trên courseId
    const progress = Math.floor(Math.random() * 100)
    return Math.max(progress, 0)
  }

  // Lấy trạng thái khóa học
  const getCourseStatus = (progress: number) => {
    if (progress === 0) return { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-700 border-gray-200' }
    if (progress < 50) return { label: 'Đang học', color: 'bg-blue-100 text-blue-700 border-blue-200' }
    if (progress < 100) return { label: 'Gần hoàn thành', color: 'bg-yellow-100 text-purple-700 border-purple-200' }
    return { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200' }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để xem khóa học của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Khóa học của tôi</h1>
          <p className="text-gray-600 mt-2">Tiếp tục học tập và theo dõi tiến độ</p>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng khóa học</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {enrollments?.length || 0}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang học</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {enrollments?.filter(e => getCourseProgress(e.course_id) > 0 && getCourseProgress(e.course_id) < 100).length || 0}
                  </p>
                </div>
                <Play className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {enrollments?.filter(e => getCourseProgress(e.course_id) === 100).length || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chưa bắt đầu</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {enrollments?.filter(e => getCourseProgress(e.course_id) === 0).length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danh sách khóa học */}
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tải khóa học...</p>
                </div>
              </CardContent>
            </Card>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.courses
                const progress = getCourseProgress(enrollment.course_id)
                const status = getCourseStatus(progress)
                
                return (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-purple-600" />
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 line-clamp-2">
                            {course?.title || 'Khóa học không tên'}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {course?.description || 'Không có mô tả'}
                          </CardDescription>
                        </div>
                        <Badge className={`ml-2 ${status.color}`}>
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiến độ</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Course info */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Trình độ:</span>
                          <span className="font-medium">{course?.level || 'Không xác định'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Thời lượng:</span>
                          <span className="font-medium">{course?.duration_weeks || 0} tuần</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Đăng ký:</span>
                          <span className="font-medium">{formatDate(enrollment.created_at)}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Action buttons */}
                      <div className="space-y-2">
                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/course/${course?.slug}`)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Tiếp tục học
                        </Button>
                        
                        {progress === 100 && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate(`/course/${course?.slug}/certificate`)}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Xem chứng chỉ
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có khóa học nào
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Bạn chưa đăng ký khóa học nào. Hãy khám phá và đăng ký khóa học đầu tiên!
                  </p>
                  <div className="space-x-4">
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Khám phá khóa học
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/transaction-history')}
                    >
                      Xem lịch sử giao dịch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
