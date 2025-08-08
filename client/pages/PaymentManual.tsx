import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/use-orders'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle, Loader2, Home, BookOpen, AlertCircle } from 'lucide-react'

export default function PaymentManual() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { markOrderPaid } = useOrders()
  
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleManualPayment = async () => {
    if (!orderId.trim()) {
      toast.error('Vui lòng nhập mã đơn hàng')
      return
    }

    try {
      setLoading(true)
      
      // Đánh dấu đơn hàng đã thanh toán
      await markOrderPaid(orderId.trim())
      
      setSuccess(true)
      toast.success('Đã xác nhận thanh toán thành công!')
      
    } catch (err) {
      console.error('Error marking order as paid:', err)
      toast.error('Có lỗi xảy ra khi xác nhận thanh toán')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để xác nhận thanh toán</CardDescription>
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
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Xác nhận thanh toán thủ công
            </CardTitle>
            <CardDescription>
              Nếu bạn đã thanh toán thành công nhưng hệ thống chưa nhận được xác nhận, 
              hãy nhập mã đơn hàng để xác nhận thủ công.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!success ? (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orderId">Mã đơn hàng</Label>
                    <Input
                      id="orderId"
                      placeholder="Nhập mã đơn hàng (VD: ORD123456)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      💡 Hướng dẫn
                    </h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Mã đơn hàng thường bắt đầu bằng "ORD"</li>
                      <li>• Kiểm tra email xác nhận đơn hàng</li>
                      <li>• Hoặc kiểm tra trong lịch sử giao dịch</li>
                      <li>• Nếu không tìm thấy, hãy liên hệ hỗ trợ</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleManualPayment}
                    disabled={loading || !orderId.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Xác nhận thanh toán
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/transaction-history')}
                    className="flex-1"
                    size="lg"
                  >
                    Xem lịch sử giao dịch
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-green-800 text-center mb-2">
                    Xác nhận thanh toán thành công!
                  </h3>
                  <p className="text-green-700 text-sm text-center">
                    Đơn hàng của bạn đã được xác nhận và bạn đã được cấp quyền truy cập khóa học.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/my-courses')}
                    className="flex-1"
                    size="lg"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Xem khóa học của tôi
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                    size="lg"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Về trang chủ
                  </Button>
                </div>
              </>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Nếu bạn đã thanh toán nhưng chưa nhận được khóa học, hãy sử dụng tính năng này</p>
              <p>• Hệ thống sẽ kiểm tra và cấp quyền truy cập ngay lập tức</p>
              <p>• Nếu vẫn gặp vấn đề, vui lòng liên hệ hỗ trợ</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
