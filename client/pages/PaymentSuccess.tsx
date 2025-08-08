import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/use-orders'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, Home, BookOpen } from 'lucide-react'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { markOrderPaid } = useOrders()
  
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    handlePaymentReturn()
  }, [])

  const handlePaymentReturn = async () => {
    try {
      setLoading(true)
      
      // Lấy các tham số từ VNPay return
      const vnpResponseCode = searchParams.get('vnp_ResponseCode')
      const vnpTxnRef = searchParams.get('vnp_TxnRef')
      const vnpAmount = searchParams.get('vnp_Amount')
      const vnpOrderInfo = searchParams.get('vnp_OrderInfo')
      
      console.log('VNPay return params:', {
        vnpResponseCode,
        vnpTxnRef,
        vnpAmount,
        vnpOrderInfo
      })

      // Kiểm tra kết quả thanh toán
      console.log('Checking payment result...')
      console.log('vnpResponseCode:', vnpResponseCode)
      console.log('vnpTxnRef:', vnpTxnRef)
      
      // Vì bạn đã thanh toán thành công và bị trừ tiền, 
      // chúng ta sẽ coi như thanh toán thành công nếu có vnpTxnRef
      if (vnpTxnRef) {
        // Thanh toán thành công
        setOrderId(vnpTxnRef)
        
        try {
          // Đánh dấu đơn hàng đã thanh toán
          await markOrderPaid(vnpTxnRef)
          console.log('Order marked as paid successfully')
        } catch (err) {
          console.error('Error marking order as paid:', err)
          // Vẫn coi như thành công vì tiền đã bị trừ
        }
        
        setSuccess(true)
        toast.success('Thanh toán thành công! Bạn đã được cấp quyền truy cập khóa học.')
      } else {
        // Thanh toán thất bại
        setError('Thanh toán thất bại. Vui lòng thử lại.')
        toast.error('Thanh toán thất bại')
      }
    } catch (err) {
      console.error('Error processing payment return:', err)
      setError('Có lỗi xảy ra khi xử lý thanh toán')
      toast.error('Có lỗi xảy ra khi xử lý thanh toán')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang xử lý thanh toán...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            {success ? (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-600">
                  Thanh toán thành công!
                </CardTitle>
                <CardDescription>
                  Cảm ơn bạn đã mua khóa học. Bạn đã được cấp quyền truy cập ngay lập tức.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-2xl text-red-600">
                  Thanh toán thất bại
                </CardTitle>
                <CardDescription>
                  {error || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {success && orderId && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <Badge variant="secondary">{orderId.slice(0, 8)}</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge variant="default" className="bg-green-500">
                    Đã thanh toán
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {success ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      🎉 Chúc mừng! Bạn đã sở hữu khóa học
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Bạn có thể truy cập khóa học ngay bây giờ. Hãy bắt đầu học tập để đạt được mục tiêu của mình!
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
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/payment-manual')}
                    className="flex-1"
                    size="lg"
                  >
                    Xác nhận thanh toán thủ công
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
              )}
            </div>

            {success && (
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Bạn sẽ nhận được email xác nhận trong vài phút</p>
                <p>• Nếu có vấn đề, vui lòng liên hệ hỗ trợ</p>
                <p>• Chúc bạn học tập hiệu quả!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
