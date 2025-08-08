import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/use-orders'
import { useBalance } from '../hooks/use-balance'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { Loader2, CreditCard, ArrowLeft, Wallet, CheckCircle } from 'lucide-react'

export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getOrderById, markOrderPaid } = useOrders()
  const { balance, payWithBalance } = useBalance()

  // Format số tiền với dấu chấm cho hiển thị
  const formatDisplayAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN')
  }
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (orderId) {
      loadOrder()
    }
  }, [orderId, user])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const orderData = await getOrderById(orderId!)
      setOrder(orderData)
    } catch (err) {
      setError('Không thể tải thông tin đơn hàng')
      console.error('Error loading order:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayWithBalance = async () => {
    if (!order || !balance) {
      toast.error('Không thể thanh toán')
      return
    }

    if (balance.balance_vnd < order.total_amount_vnd) {
      toast.error('Số dư không đủ để thanh toán')
      navigate('/recharge')
      return
    }

    try {
      setProcessing(true)
      
      // Thanh toán bằng số dư
      const result = await payWithBalance(order.total_amount_vnd)
      
      // Cập nhật trạng thái đơn hàng
      await markOrderPaid(order.id)
      
      toast.success('Thanh toán thành công! Bạn đã được cấp quyền truy cập khóa học.')
      navigate('/payment/success')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thanh toán'
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải thông tin đơn hàng...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/cart')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại giỏ hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Không tìm thấy đơn hàng</CardTitle>
            <CardDescription>Đơn hàng không tồn tại hoặc đã bị xóa</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/cart')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại giỏ hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasEnoughBalance = balance && balance.balance_vnd >= order.total_amount_vnd

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại giỏ hàng
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
          <p className="text-gray-600 mt-2">Thanh toán bằng số dư tài khoản</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin đơn hàng */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
                <CardDescription>Đơn hàng #{order.id.slice(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                      {order.status === 'pending' ? 'Chờ thanh toán' : order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <Separator />

                  {/* Danh sách khóa học */}
                  <div>
                    <h3 className="font-semibold mb-3">Khóa học đã chọn:</h3>
                    <div className="space-y-3">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.courses?.title || 'Khóa học'}</h4>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(item.amount_vnd)}
                          </span>
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
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatDisplayAmount(order.total_amount_vnd)} VND
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
                          Số dư đủ để thanh toán. Số dư còn lại: {formatDisplayAmount(balance.balance_vnd - order.total_amount_vnd)} VND
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handlePayWithBalance}
                        disabled={processing || order.status !== 'pending'}
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
                    <p>• Truy cập khóa học ngay sau thanh toán</p>
                    <p>• Hỗ trợ hoàn tiền trong 30 ngày</p>
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
