import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'
import { QrCode, Loader2 } from 'lucide-react'
import { Separator } from '../components/ui/separator'

export default function TestQRCode() {
  const [amount, setAmount] = useState('50000')
  const [orderId, setOrderId] = useState('test-order-123')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const createVNPayQRCode = () => {
    try {
      setLoading(true)
      
      // Tạo mã giao dịch duy nhất
      const txnRef = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Số tiền phải là số nguyên (không có dấu phẩy)
      const amountValue = Math.round(parseInt(amount) * 100)
      
      // Tạo URL VNPay để thanh toán
      const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&vnp_TmnCode=2QXUI4J4&vnp_Amount=${amountValue}&vnp_CurrCode=VND&vnp_BankCode=&vnp_TxnRef=${txnRef}&vnp_OrderInfo=Test thanh toan - ${orderId}&vnp_OrderType=billpayment&vnp_Locale=vn&vnp_ReturnUrl=${encodeURIComponent(window.location.origin + '/payment/success')}&vnp_IpAddr=127.0.0.1&vnp_CreateDate=${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '')}`
      
      // Tạo mã QR từ URL VNPay
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vnpayUrl)}`
      
      setQrCodeUrl(qrCodeUrl)
      
      console.log('VNPay URL:', vnpayUrl)
      console.log('QR Code URL:', qrCodeUrl)
      
      toast.success('Đã tạo mã QR thanh toán VNPay')
    } catch (error) {
      console.error('Error creating VNPay QR code:', error)
      toast.error('Có lỗi xảy ra khi tạo mã QR')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test VNPay QR Code</CardTitle>
            <CardDescription>
              Tạo mã QR thanh toán VNPay để test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền (VND)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orderId">Mã đơn hàng</Label>
                <Input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="test-order-123"
                />
              </div>
              
              <Button 
                onClick={createVNPayQRCode} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo mã QR...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Tạo mã QR thanh toán VNPay
                  </>
                )}
              </Button>
            </div>

            {/* Hiển thị QR Code */}
            {qrCodeUrl && (
              <div className="space-y-4">
                <Separator />
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Mã QR thanh toán:</h3>
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img 
                      src={qrCodeUrl} 
                      alt="VNPay QR Code" 
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                  </p>
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Mã QR sẽ chứa thông tin thanh toán VNPay</p>
              <p>• Quét bằng ứng dụng ngân hàng để thanh toán</p>
              <p>• Sử dụng VNPay sandbox để test</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
