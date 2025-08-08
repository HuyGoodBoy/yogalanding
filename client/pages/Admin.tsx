import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../hooks/use-admin'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { 
  Loader2, 
  Plus, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Calendar,
  DollarSign,
  Users,
  RefreshCw,
  BookOpen,
  Youtube
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isAdmin, adminProfile, loading, createRechargeCode, getRechargeCodes } = useAdmin()
  
  const [amount, setAmount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [rechargeCodes, setRechargeCodes] = useState<any[]>([])
  const [loadingCodes, setLoadingCodes] = useState(false)

  // Format số tiền với dấu chấm
  const formatAmountInput = (value: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, '')
    
    if (numericValue === '') return ''
    
    // Chuyển thành số và format với dấu chấm
    const number = parseInt(numericValue)
    return number.toLocaleString('vi-VN')
  }

  // Chuyển đổi từ format có dấu chấm về số nguyên
  const parseAmountInput = (formattedValue: string) => {
    return parseInt(formattedValue.replace(/\./g, '')) || 0
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const loadRechargeCodes = async () => {
    try {
      setLoadingCodes(true)
      const codes = await getRechargeCodes()
      setRechargeCodes(codes)
    } catch (error) {
      console.error('Error loading recharge codes:', error)
    } finally {
      setLoadingCodes(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadRechargeCodes()
    }
  }, [isAdmin])

  const handleCreateCode = async () => {
    if (!amount.trim()) {
      toast.error('Vui lòng nhập mệnh giá')
      return
    }

    const amountValue = parseAmountInput(amount)
    if (amountValue <= 0) {
      toast.error('Mệnh giá phải lớn hơn 0')
      return
    }

    try {
      setProcessing(true)
      const result = await createRechargeCode(amountValue)
      
      toast.success(`Đã tạo mã nạp tiền: ${result.code} - ${formatCurrency(result.amount)}`)
      setAmount('')
      
      // Reload danh sách mã
      await loadRechargeCodes()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo mã'
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã copy mã vào clipboard')
  }

  if (loading) {
    console.log('Admin component - still loading...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang kiểm tra quyền admin...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để truy cập trang admin</CardDescription>
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

  console.log('Admin component - isAdmin:', isAdmin, 'loading:', loading, 'user:', user)
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Không có quyền truy cập</CardTitle>
            <CardDescription>Bạn không có quyền admin để truy cập trang này</CardDescription>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <PageHeader 
          title="Quản lý Admin"
          description="Tạo và quản lý mã nạp tiền"
          backUrl="/"
          backText="Về trang chủ"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin admin */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Thông tin Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Email:</Label>
                    <p className="font-medium">{adminProfile?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Tên:</Label>
                    <p className="font-medium">{adminProfile?.full_name || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Vai trò:</Label>
                    <Badge variant="default" className="ml-2">
                      Admin
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tạo mã nạp tiền */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Tạo mã nạp tiền
                </CardTitle>
                <CardDescription>Tạo mã nạp tiền với mệnh giá tùy chọn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Mệnh giá (VND)</Label>
                    <div className="flex space-x-2">
                                             <Input
                         id="amount"
                         type="text"
                         placeholder="Nhập mệnh giá (VD: 50.000)"
                         value={amount}
                         onChange={(e) => {
                           const formattedValue = formatAmountInput(e.target.value)
                           setAmount(formattedValue)
                         }}
                         className="flex-1"
                       />
                      <Button 
                        onClick={handleCreateCode}
                        disabled={processing || !amount.trim()}
                        className="min-w-[120px]"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo mã
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Mã sẽ được tạo ngẫu nhiên 8 ký tự</p>
                    <p>• Mã có hiệu lực trong 30 ngày</p>
                    <p>• Mỗi mã chỉ sử dụng được 1 lần</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Danh sách mã nạp tiền */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Danh sách mã nạp tiền
                </CardTitle>
                <Button 
                  onClick={loadRechargeCodes}
                  disabled={loadingCodes}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loadingCodes ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCodes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Đang tải...</span>
                </div>
              ) : rechargeCodes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có mã nạp tiền nào
                </div>
              ) : (
                <div className="space-y-3">
                  {rechargeCodes.map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded">
                            {code.code}
                          </div>
                          <Badge variant={code.is_used ? 'secondary' : 'default'}>
                            {code.is_used ? 'Đã sử dụng' : 'Chưa sử dụng'}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            Mệnh giá: <span className="font-semibold text-green-600">{formatCurrency(code.amount_vnd)}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Tạo lúc: {formatDate(code.created_at)}
                          </p>
                          {code.is_used && (
                            <p className="text-sm text-gray-600">
                              Sử dụng lúc: {formatDate(code.used_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => copyToClipboard(code.code)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {code.is_used ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quản lý khóa học */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Quản lý khóa học
                </CardTitle>
                <Button 
                  onClick={() => navigate('/create-course')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo khóa học mới
                </Button>
              </div>
              <CardDescription>
                Tạo và quản lý khóa học với tích hợp YouTube
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Youtube className="w-6 h-6 text-red-600" />
                    <h3 className="font-semibold text-blue-800">Tích hợp YouTube</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Tải video lên YouTube và liên kết với khóa học để học viên có thể xem trực tiếp.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <BookOpen className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-800">Quản lý nội dung</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    Tạo khóa học với thông tin chi tiết, giá cả và playlist video hướng dẫn.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Học viên truy cập</h3>
                  </div>
                  <p className="text-purple-700 text-sm">
                    Học viên đã mua khóa học có thể truy cập playlist YouTube để học tập.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/create-course')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo khóa học mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
