import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { CreditCard, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react'

export default function MockVNPay() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState<'payment' | 'success' | 'failed'>('payment')

  // Lấy thông tin từ URL parameters
  const amount = searchParams.get('vnp_Amount')
  const txnRef = searchParams.get('vnp_TxnRef')
  const orderInfo = searchParams.get('vnp_OrderInfo')
  const returnUrl = searchParams.get('vnp_ReturnUrl')

  const formatAmount = (amountStr: string | null) => {
    if (!amountStr) return '0 VND'
    const amountNum = parseInt(amountStr) / 100
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amountNum)
  }

  const handlePaymentSuccess = () => {
    setProcessing(true)
    
    // Mô phỏng thời gian xử lý
    setTimeout(() => {
      setStep('success')
      setProcessing(false)
      
      // Chuyển hướng về trang success
      if (returnUrl) {
        const successUrl = `${returnUrl}?vnp_ResponseCode=00&vnp_TxnRef=${txnRef}&vnp_Amount=${amount}&vnp_OrderInfo=${orderInfo}`
        window.location.href = successUrl
      }
    }, 2000)
  }

  const handlePaymentFailed = () => {
    setProcessing(true)
    
    setTimeout(() => {
      setStep('failed')
      setProcessing(false)
      
      // Chuyển hướng về trang success với lỗi
      if (returnUrl) {
        const failedUrl = `${returnUrl}?vnp_ResponseCode=99&vnp_TxnRef=${txnRef}&vnp_Amount=${amount}&vnp_OrderInfo=${orderInfo}`
        window.location.href = failedUrl
      }
    }, 2000)
  }

  const handleCancel = () => {
    if (returnUrl) {
      const cancelUrl = `${returnUrl}?vnp_ResponseCode=24&vnp_TxnRef=${txnRef}&vnp_Amount=${amount}&vnp_OrderInfo=${orderInfo}`
      window.location.href = cancelUrl
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Thanh toán thành công!</CardTitle>
            <CardDescription>Giao dịch đã được xử lý thành công</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Đang chuyển hướng...</p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600">Thanh toán thất bại</CardTitle>
            <CardDescription>Giao dịch không thể hoàn tất</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Đang chuyển hướng...</p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hủy thanh toán
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                VNPAY
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Cổng thanh toán VNPay</h1>
            <p className="text-gray-600 mt-2">Thanh toán an toàn qua VNPay</p>
          </div>
        </div>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
            <CardDescription>Vui lòng xác nhận thông tin thanh toán</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã giao dịch:</span>
                <Badge variant="secondary">{txnRef}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nội dung:</span>
                <span className="text-sm">{orderInfo}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số tiền:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatAmount(amount)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Bank Selection */}
            <div>
              <h3 className="font-semibold mb-3">Chọn ngân hàng:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">VPBank</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0902200177</p>
                </div>
                
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Vietcombank</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">1234567890</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handlePaymentSuccess}
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
                    Thanh toán thành công
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handlePaymentFailed}
                disabled={processing}
                variant="outline"
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
                    <XCircle className="mr-2 h-4 w-4" />
                    Thanh toán thất bại
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Đây là trang mô phỏng VNPay để test</p>
              <p>• Trong thực tế sẽ tích hợp với VNPay thật</p>
              <p>• Thông tin ngân hàng: VPBank 0902200177</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
