import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../hooks/use-admin'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { Upload, Youtube, Link, Save, Loader2, AlertCircle, CheckCircle, Image, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function CreateCourse() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, profile } = useAuth()
  
  // Check admin status from profile
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin'
  
  // Check if we're in edit mode
  const editCourseId = searchParams.get('edit')
  const isEditMode = !!editCourseId
  
  // Thêm state local để track admin status
  const [localIsAdmin, setLocalIsAdmin] = useState<boolean | null>(null)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [adminLoading, setAdminLoading] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [courseId, setCourseId] = useState<string | null>(null)
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail_url: '',
    level: 'Cơ bản',
    duration_weeks: 8,
    price_vnd: 999000,
    instructor: 'Phạm Diệu Thuý',
    youtube_playlist_url: '',
    status: 'published'
  })

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load course data for edit mode
  const loadCourseForEdit = async (courseId: string) => {
    try {
      setLoading(true)
      
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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu khóa học')
      }

      const courses = await response.json()
      if (courses && courses.length > 0) {
        const course = courses[0]
        setFormData({
          title: course.title || '',
          slug: course.slug || '',
          description: course.description || '',
          thumbnail_url: course.thumbnail_url || '',
          level: course.level || 'Cơ bản',
          duration_weeks: course.duration_weeks || 8,
          price_vnd: course.price_vnd || 999000,
          instructor: course.instructor || 'Phạm Diệu Thuý',
          youtube_playlist_url: course.youtube_playlist_url || '',
          status: course.status || 'published'
        })
        
        if (course.thumbnail_url) {
          setImagePreview(course.thumbnail_url)
        }
      }
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Không thể tải dữ liệu khóa học')
    } finally {
      setLoading(false)
    }
  }

  // Check admin access
  useEffect(() => {
    console.log('CreateCourse - useEffect triggered')
    console.log('CreateCourse - user:', user)
    console.log('CreateCourse - isAdmin:', isAdmin)
    console.log('CreateCourse - adminLoading:', adminLoading)
    
    if (!user) {
      console.log('CreateCourse - No user, redirecting to login')
      navigate('/login')
      return
    }
    
    // Nếu adminLoading đã xong và isAdmin là false
    if (!adminLoading && !isAdmin) {
      console.log('CreateCourse - Not admin, redirecting to home')
      toast.error('Bạn không có quyền truy cập trang này')
      navigate('/')
      return
    }
    
    // Nếu adminLoading đã xong và isAdmin là true
    if (!adminLoading && isAdmin) {
      console.log('CreateCourse - Admin access granted')
      setLocalIsAdmin(true)
      setCheckingAdmin(false)
    }
    
    // Nếu vẫn đang loading
    if (adminLoading) {
      console.log('CreateCourse - Still checking admin status...')
    }
  }, [user, isAdmin, adminLoading, navigate])

  // Load course data for edit mode
  useEffect(() => {
    if (isEditMode && editCourseId && isAdmin) {
      loadCourseForEdit(editCourseId)
    }
  }, [isEditMode, editCourseId, isAdmin])

  // Auto-generate slug from title (only in create mode)
  useEffect(() => {
    if (!isEditMode && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isEditMode])

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh hợp lệ')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File ảnh không được lớn hơn 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image to Supabase Storage
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    // Get access token
    const token = localStorage.getItem('supabase.auth.token')
    if (!token) {
      throw new Error('Không thể xác thực')
    }
    
    const tokenData = JSON.parse(token)
    const accessToken = tokenData?.currentSession?.access_token

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Upload to Supabase Storage using the correct API
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${supabaseUrl}/storage/v1/object/course-images/${filename}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': supabaseAnonKey
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload error:', errorText)
      throw new Error(`Không thể upload ảnh lên server: ${errorText}`)
    }

    // Return the public URL
    return `${supabaseUrl}/storage/v1/object/public/course-images/${filename}`
  }

  // Save image to localStorage
  const saveImageToLocalStorage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        const timestamp = Date.now()
        const key = `course-thumbnail-${timestamp}`
        
        // Save to localStorage
        localStorage.setItem(key, imageData)
        
        // Return the key as URL
        resolve(`local://${key}`)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Vui lòng chọn ảnh trước')
      return
    }

    try {
      setUploadingImage(true)
      
      // Try Supabase Storage first, fallback to localStorage
      let imageUrl: string
      
      try {
        imageUrl = await uploadImageToSupabase(imageFile)
        toast.success('Upload ảnh thành công!')
      } catch (error) {
        console.warn('Supabase upload failed, using localStorage:', error)
        imageUrl = await saveImageToLocalStorage(imageFile)
        toast.success('Lưu ảnh vào bộ nhớ local thành công!')
      }
      
      // Update form data
      setFormData(prev => ({ ...prev, thumbnail_url: imageUrl }))
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Có lỗi xảy ra khi upload ảnh')
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove image
  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, thumbnail_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên khóa học'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Vui lòng nhập slug'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả khóa học'
    }

    // Only require thumbnail if no image has been uploaded yet
    if (!formData.thumbnail_url.trim() && !imagePreview) {
      newErrors.thumbnail_url = 'Vui lòng upload ảnh đại diện'
    }

    // YouTube URL is optional, no validation needed

    if (formData.price_vnd <= 0) {
      newErrors.price_vnd = 'Giá khóa học phải lớn hơn 0'
    }

    if (formData.duration_weeks <= 0) {
      newErrors.duration_weeks = 'Thời lượng phải lớn hơn 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin')
      return
    }

    try {
      setLoading(true)
      
      // If there's an image file that hasn't been uploaded yet, upload it first
      let finalThumbnailUrl = formData.thumbnail_url
      if (imageFile && !formData.thumbnail_url) {
        try {
          finalThumbnailUrl = await uploadImageToSupabase(imageFile)
          toast.success('Upload ảnh thành công!')
        } catch (error) {
          console.warn('Supabase upload failed, using localStorage:', error)
          finalThumbnailUrl = await saveImageToLocalStorage(imageFile)
          toast.success('Lưu ảnh vào bộ nhớ local thành công!')
        }
      }
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      // Get access token
      const token = localStorage.getItem('supabase.auth.token')
      if (!token) {
        throw new Error('Không thể xác thực')
      }
      
      const tokenData = JSON.parse(token)
      const accessToken = tokenData?.currentSession?.access_token

      const courseData = {
        ...formData,
        thumbnail_url: finalThumbnailUrl,
        price_vnd: parseInt(formData.price_vnd.toString()),
        duration_weeks: parseInt(formData.duration_weeks.toString())
      }

      console.log('Submitting course data:', courseData)
      
      let response
      if (isEditMode && editCourseId) {
        // Update existing course
        console.log('Updating course:', editCourseId)
        response = await fetch(`${supabaseUrl}/rest/v1/courses?id=eq.${editCourseId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(courseData)
        })
      } else {
        // Create new course
        console.log('Creating new course')
        response = await fetch(`${supabaseUrl}/rest/v1/courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(courseData)
        })
      }
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        let errorMessage = `Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'tạo'} khóa học`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If response is not JSON, get text
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      if (isEditMode) {
        setSuccess(true)
        toast.success('Cập nhật khóa học thành công!')
      } else {
        // Try to parse response as JSON, but handle case where it might be empty
        try {
          const responseText = await response.text()
          if (responseText) {
            const newCourse = JSON.parse(responseText)
            if (newCourse && newCourse.length > 0) {
              setCourseId(newCourse[0].id)
            }
          }
        } catch (e) {
          console.warn('Could not parse course response:', e)
          // Continue anyway as the course might have been created successfully
        }
        setSuccess(true)
        toast.success('Tạo khóa học thành công!')
      }
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} course:`, error)
      toast.error(error instanceof Error ? error.message : `Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'tạo'} khóa học`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  console.log('CreateCourse - Render check - user:', user, 'isAdmin:', isAdmin, 'adminLoading:', adminLoading, 'localIsAdmin:', localIsAdmin, 'checkingAdmin:', checkingAdmin)
  
  // Show loading while checking admin status
  if (checkingAdmin || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang kiểm tra quyền admin...</span>
        </div>
      </div>
    )
  }
  
  // TEMPORARY: Bypass admin check for testing
  const bypassAdminCheck = true
  
  if (!user || (!isAdmin && !bypassAdminCheck)) {
    console.log('CreateCourse - Access denied - user:', !!user, 'isAdmin:', isAdmin)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Không có quyền truy cập</CardTitle>
            <CardDescription>Bạn cần quyền admin để tạo khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                {isEditMode ? 'Cập nhật khóa học thành công!' : 'Tạo khóa học thành công!'}
              </CardTitle>
              <CardDescription>
                {isEditMode ? 'Khóa học đã được cập nhật thành công' : 'Khóa học đã được tạo và sẵn sàng cho học viên đăng ký'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Thông tin khóa học
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên khóa học:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slug:</span>
                    <span className="font-medium">{formData.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-medium">{formData.price_vnd.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge className="bg-green-500">Đã xuất bản</Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate(`/course/${formData.slug}`)}
                  className="flex-1"
                  size="lg"
                >
                  <Link className="mr-2 h-4 w-4" />
                  Xem khóa học
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSuccess(false)
                    setFormData({
                      title: '',
                      slug: '',
                      description: '',
                      thumbnail_url: '',
                      level: 'Cơ bản',
                      duration_weeks: 8,
                      price_vnd: 999000,
                      instructor: 'Phạm Diệu Thuý',
                      youtube_playlist_url: '',
                      status: 'published'
                    })
                    removeImage()
                  }}
                  className="flex-1"
                  size="lg"
                >
                  Tạo khóa học mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <PageHeader 
          title={isEditMode ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          description={isEditMode ? "Chỉnh sửa thông tin khóa học" : "Tạo khóa học với video hướng dẫn từ YouTube"}
          backUrl="/admin/courses"
          backText="Về quản lý khóa học"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{isEditMode ? "Chỉnh sửa khóa học" : "Tạo khóa học"}</CardTitle>
                <CardDescription>
                  Điền thông tin khóa học và liên kết với playlist YouTube
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Tên khóa học *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="VD: Yoga Cơ Bản"
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          placeholder="VD: yoga-co-ban"
                          className={errors.slug ? 'border-red-500' : ''}
                        />
                        {errors.slug && (
                          <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả khóa học *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Mô tả chi tiết về khóa học..."
                        rows={4}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label>Ảnh đại diện khóa học *</Label>
                      <div className="mt-2 space-y-4">
                        {/* Current image preview */}
                        {(imagePreview || formData.thumbnail_url) && (
                          <div className="relative">
                            <img 
                              src={imagePreview || formData.thumbnail_url} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Upload controls */}
                        <div className="flex items-center space-x-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <Image className="mr-2 h-4 w-4" />
                            Chọn ảnh
                          </Button>
                          
                          {imageFile && (
                            <Button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={uploadingImage}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Đang upload...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload ảnh
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>• Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
                          <p>• Ảnh sẽ được upload lên server hoặc lưu vào bộ nhớ local</p>
                        </div>
                        
                        {errors.thumbnail_url && (
                          <p className="text-red-500 text-sm">{errors.thumbnail_url}</p>
                        )}
                        
                        {/* Show upload status */}
                        {imageFile && !formData.thumbnail_url && (
                          <p className="text-blue-500 text-sm">
                            Ảnh đã được chọn, sẽ được upload khi tạo khóa học
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Course Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết khóa học</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="level">Trình độ</Label>
                        <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                            <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                            <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="duration_weeks">Thời lượng (tuần) *</Label>
                        <Input
                          id="duration_weeks"
                          type="number"
                          value={formData.duration_weeks}
                          onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value))}
                          min="1"
                          className={errors.duration_weeks ? 'border-red-500' : ''}
                        />
                        {errors.duration_weeks && (
                          <p className="text-red-500 text-sm mt-1">{errors.duration_weeks}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="price_vnd">Giá (VND) *</Label>
                        <Input
                          id="price_vnd"
                          type="number"
                          value={formData.price_vnd}
                          onChange={(e) => handleInputChange('price_vnd', parseInt(e.target.value))}
                          min="0"
                          className={errors.price_vnd ? 'border-red-500' : ''}
                        />
                        {errors.price_vnd && (
                          <p className="text-red-500 text-sm mt-1">{errors.price_vnd}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* YouTube Integration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tích hợp YouTube</h3>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Youtube className="w-6 h-6 text-red-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Tích hợp YouTube (tùy chọn)
                          </h4>
                          <ol className="text-blue-700 text-sm space-y-1">
                            <li>1. Tải video hướng dẫn lên YouTube (nếu có)</li>
                            <li>2. Tạo playlist cho khóa học</li>
                            <li>3. Sao chép URL playlist (VD: https://youtube.com/playlist?list=...)</li>
                            <li>4. Dán vào ô bên dưới (không bắt buộc)</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="youtube_playlist_url">URL Playlist YouTube (tùy chọn)</Label>
                      <Input
                        id="youtube_playlist_url"
                        value={formData.youtube_playlist_url}
                        onChange={(e) => handleInputChange('youtube_playlist_url', e.target.value)}
                        placeholder="https://youtube.com/playlist?list=... (không bắt buộc)"
                        className={errors.youtube_playlist_url ? 'border-red-500' : ''}
                      />
                      {errors.youtube_playlist_url && (
                        <p className="text-red-500 text-sm mt-1">{errors.youtube_playlist_url}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Submit */}
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin')}
                    >
                      Hủy
                    </Button>
                    
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {isEditMode ? 'Cập nhật khóa học' : 'Tạo khóa học'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Xem trước</CardTitle>
                <CardDescription>Khóa học sẽ hiển thị như thế này</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {(imagePreview || formData.thumbnail_url) && (
                  <img 
                    src={imagePreview || formData.thumbnail_url} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formData.title || 'Tên khóa học'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.description || 'Mô tả khóa học...'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{formData.level}</Badge>
                    <span className="text-gray-500">{formData.duration_weeks} tuần</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formData.price_vnd.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                
                {formData.youtube_playlist_url && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-green-700">Đã liên kết YouTube</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
