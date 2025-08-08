import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'

export default function TestPayment() {
  const [amount, setAmount] = useState('50000')
  const [orderId, setOrderId] = useState('test-order-123')

  const createVNPayUrl = () => {
    try {
      // Tạo mã giao dịch duy nhất
      const txnRef = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Format thời gian theo chuẩn VNPay (YYYYMMDDHHmmss)
      const createDate = new Date().toISOString()
        .replace(/[-:]/g, '')
        .replace(/\..+/, '')
        .replace('T', '')
      
      // Số tiền phải là số nguyên (không có dấu phẩy)
      const amountValue = Math.round(parseInt(amount) * 100)
      
      const params = new URLSearchParams({
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: '2QXUI4J4',
        vnp_Amount: amountValue.toString(),
        vnp_CurrCode: 'VND',
        vnp_BankCode: '',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Test thanh toan - ${orderId}`,
        vnp_OrderType: 'billpayment',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: `${window.location.origin}/payment/success`,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: createDate
      })

      const url = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${params.toString()}`
      
             console.log('VNPay URL:', url)
       console.log('Parameters:', Object.fromEntries(params.entries()))
       
       // Mở URL trong tab mới
       window.open(url, '_blank')
       
       toast.success('Đã tạo URL thanh toán VNPay')
    } catch (error) {
      console.error('Error creating VNPay URL:', error)
      toast.error('Có lỗi xảy ra khi tạo URL thanh toán')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test VNPay Payment</CardTitle>
            <CardDescription>
              Tạo URL thanh toán VNPay để test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <Button onClick={createVNPayUrl} className="w-full">
              Tạo URL thanh toán VNPay
            </Button>
            
                         <div className="text-xs text-gray-500 space-y-1">
               <p>• URL sẽ mở trong tab mới</p>
               <p>• Kiểm tra console để xem parameters</p>
               <p>• Sử dụng VNPay sandbox để test</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
