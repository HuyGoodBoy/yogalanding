import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useBalance } from '../hooks/use-balance'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { Loader2, CreditCard, ArrowLeft, Wallet, CheckCircle, Crown } from 'lucide-react'

export default function SubscriptionPayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { balance, payWithBalance } = useBalance()
  
  const [processing, setProcessing] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [amount, setAmount] = useState(0)

  // Format số tiền với dấu chấm cho hiển thị
  const formatDisplayAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN')
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Lấy thông tin plan từ navigation state
    if (location.state?.plan && location.state?.amount) {
      setPlan(location.state.plan)
      setAmount(location.state.amount)
    } else {
      // Nếu không có state, redirect về trang chủ
      navigate('/')
    }
  }, [user, location.state, navigate])

  const handlePayWithBalance = async () => {
    if (!plan || !balance) {
      toast.error('Không thể thanh toán')
      return
    }

    if (balance.balance_vnd < amount) {
      toast.error('Số dư không đủ để thanh toán')
      navigate('/recharge')
      return
    }

    try {
      setProcessing(true)
      
      // Thanh toán bằng số dư
      const result = await payWithBalance(amount)
      
      toast.success(`Đăng ký gói ${plan} thành công! Bạn đã được cấp quyền truy cập.`)
      navigate('/')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thanh toán'
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const getPlanFeatures = (planName: string) => {
    switch (planName) {
      case 'Cơ bản':
        return [
          'Truy cập 50+ video bài tập',
          'Hỗ trợ qua email',
          'Học theo tốc độ riêng',
          'Chất lượng HD'
        ]
      case 'Pro':
        return [
          'Truy cập toàn bộ khóa học',
          'Live class hàng tuần',
          'Hỗ trợ 1-1 với giảng viên',
          'Chất lượng 4K',
          'Chứng chỉ hoàn thành',
          'Cộng đồng riêng'
        ]
      case 'Premium':
        return [
          'Tất cả tính năng Pro',
          'Khóa học riêng 1-1',
          'Tư vấn dinh dưỡng',
          'Kế hoạch tập luyện cá nhân',
          'Hỗ trợ 24/7',
          'Ưu tiên tham gia workshop'
        ]
      default:
        return []
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để thanh toán</CardDescription>
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

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy thông tin gói</CardTitle>
            <CardDescription>Vui lòng chọn gói từ trang chủ</CardDescription>
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

  const hasEnoughBalance = balance && balance.balance_vnd >= amount

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán gói {plan}</h1>
          <p className="text-gray-600 mt-2">Thanh toán bằng số dư tài khoản</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin gói */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="mr-2 h-5 w-5" />
                  Thông tin gói {plan}
                </CardTitle>
                <CardDescription>Gói subscription hàng tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gói:</span>
                    <Badge variant="default" className="text-lg">
                      {plan}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Thời hạn:</span>
                    <span>1 tháng</span>
                  </div>

                  <Separator />

                  {/* Danh sách tính năng */}
                  <div>
                    <h3 className="font-semibold mb-3">Tính năng bao gồm:</h3>
                    <div className="space-y-2">
                      {getPlanFeatures(plan).map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Thanh toán */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán</CardTitle>
                <CardDescription>Thanh toán bằng số dư tài khoản</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Số dư hiện tại */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Số dư hiện tại:</span>
                      <Wallet className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatDisplayAmount(balance?.balance_vnd || 0)} VND
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá gói:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatDisplayAmount(amount)} VND
                    </span>
                  </div>

                  <Separator />

                  {/* Kiểm tra số dư */}
                  {!hasEnoughBalance ? (
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">
                          Số dư không đủ để thanh toán. Vui lòng nạp thêm tiền.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => navigate('/recharge')}
                        className="w-full"
                        size="lg"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Nạp tiền ngay
                      </Button>
                      
                      {/* Thông tin liên hệ admin */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-700 text-sm mb-2">
                          <strong>Liên hệ Admin để nạp tiền:</strong>
                        </p>
                        <Button 
                          onClick={() => window.open('https://www.facebook.com/profile.php?id=61578792454672', '_blank')}
                          variant="outline"
                          className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                          size="sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Liên hệ Admin qua Facebook
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700 text-sm">
                          Số dư đủ để thanh toán. Số dư còn lại: {formatDisplayAmount(balance.balance_vnd - amount)} VND
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handlePayWithBalance}
                        disabled={processing}
                        className="w-full"
                        size="lg"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Thanh toán ngay
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Thanh toán an toàn bằng số dư</p>
                    <p>• Truy cập gói ngay sau thanh toán</p>
                    <p>• Tự động gia hạn hàng tháng</p>
                    <p>• Hủy bất cứ lúc nào</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
