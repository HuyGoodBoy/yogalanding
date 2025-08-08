import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useOrders } from '../hooks/use-orders'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { Loader2, ShoppingCart, Trash2, CreditCard, ArrowLeft } from 'lucide-react'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, removeFromCart, clearCart, totalPrice, totalItems } = useCart()
  const { createOrder } = useOrders()
  
  const [processing, setProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để thanh toán')
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống')
      return
    }

    try {
      setProcessing(true)
      
      // Tạo đơn hàng
      const courseIds = items.map(item => item.id)
      const totalAmount = totalPrice
      
      const orderResult = await createOrder(courseIds, totalAmount)
      
      // Chuyển hướng đến trang thanh toán
      navigate(`/payment/${orderResult.order_id}`)
      
      toast.success('Đơn hàng đã được tạo. Vui lòng hoàn tất thanh toán.')
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tạo đơn hàng')
      console.error('Error creating order:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleRemoveItem = (courseId: string) => {
    removeFromCart(courseId)
    toast.success('Đã xóa khóa học khỏi giỏ hàng')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Đã xóa tất cả khóa học')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Bạn cần đăng nhập</CardTitle>
              <CardDescription>
                Vui lòng đăng nhập để xem giỏ hàng và thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/login')} size="lg">
                Đăng nhập ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          </div>

          <Card>
            <CardHeader className="text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle>Giỏ hàng trống</CardTitle>
              <CardDescription>
                Bạn chưa có khóa học nào trong giỏ hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/')} size="lg">
                Khám phá khóa học
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
          
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-600 mt-2">
            {totalItems} khóa học trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Danh sách khóa học */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Khóa học đã chọn</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearCart}
                  >
                    Xóa tất cả
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                             <div className="flex-1">
                         <h3 className="font-semibold">{item.title}</h3>
                         <div className="flex items-center space-x-2 mt-2">
                           <Badge variant="secondary">{item.level || 'N/A'}</Badge>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="font-semibold text-lg">
                           {formatCurrency(item.price_vnd)}
                         </p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tổng thanh toán */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tổng thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền ({totalItems} khóa học):</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      disabled={processing || items.length === 0}
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
                          <CreditCard className="mr-2 h-4 w-4" />
                          Thanh toán ngay
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Thanh toán an toàn qua VNPay</p>
                    <p>• Truy cập khóa học ngay sau thanh toán</p>
                    <p>• Hỗ trợ tất cả ngân hàng</p>
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
