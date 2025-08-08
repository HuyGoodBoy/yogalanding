import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useBalance } from '../hooks/use-balance'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { Wallet, CreditCard, Loader2, CheckCircle, History } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Recharge() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { balance, transactions, loading, useRechargeCode } = useBalance()
  
  const [rechargeCode, setRechargeCode] = useState('')
  const [processing, setProcessing] = useState(false)

  // Format số tiền với dấu chấm cho hiển thị
  const formatDisplayAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN')
  }

  const handleRecharge = async () => {
    if (!rechargeCode.trim()) {
      toast.error('Vui lòng nhập mã nạp tiền')
      return
    }

    try {
      setProcessing(true)
      const result = await useRechargeCode(rechargeCode.trim().toUpperCase())
      
             toast.success(`Nạp tiền thành công! +${formatDisplayAmount(result.amount)} VND`)
      setRechargeCode('')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi nạp tiền'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để nạp tiền</CardDescription>
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
      <div className="container mx-auto px-4 max-w-4xl">
        <PageHeader 
          title="Nạp tiền"
          description="Nạp tiền vào tài khoản để mua khóa học"
          backUrl="/"
          backText="Về trang chủ"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin số dư */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Số dư hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                                             <div className="text-4xl font-bold text-green-600">
                         {formatDisplayAmount(balance?.balance_vnd || 0)} VND
                       </div>
                      <p className="text-gray-600 mt-2">
                        Cập nhật lần cuối: {balance?.updated_at ? formatDate(balance.updated_at) : 'Chưa có'}
                      </p>
                    </div>

                    <Separator />

                                         <div className="space-y-3">
                       <h3 className="font-semibold">Hướng dẫn nạp tiền:</h3>
                       <div className="space-y-2 text-sm text-gray-600">
                         <div className="flex items-center">
                           <CreditCard className="w-4 h-4 mr-2" />
                           <span>Liên hệ admin để lấy mã nạp tiền</span>
                         </div>
                         <div className="flex items-center">
                           <CheckCircle className="w-4 h-4 mr-2" />
                           <span>Nhập mã vào ô bên dưới</span>
                         </div>
                         <div className="flex items-center">
                           <Wallet className="w-4 h-4 mr-2" />
                           <span>Số dư sẽ được cộng ngay lập tức</span>
                         </div>
                       </div>
                       
                       {/* Liên hệ admin */}
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                         <h4 className="font-semibold text-blue-800 mb-2">Liên hệ Admin</h4>
                         <p className="text-sm text-blue-700 mb-3">
                           Để lấy mã nạp tiền, vui lòng liên hệ admin qua Facebook:
                         </p>
                         <Button 
                           onClick={() => window.open('https://www.facebook.com/profile.php?id=61578792454672', '_blank')}
                           className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                           size="sm"
                         >
                           <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                             <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                           </svg>
                           Liên hệ Admin qua Facebook
                         </Button>
                       </div>
                     </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Form nạp tiền */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Nạp tiền</CardTitle>
                <CardDescription>Nhập mã nạp tiền từ admin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rechargeCode">Mã nạp tiền</Label>
                  <Input
                    id="rechargeCode"
                    type="text"
                    placeholder="Nhập mã 8 ký tự"
                    value={rechargeCode}
                    onChange={(e) => setRechargeCode(e.target.value)}
                    maxLength={8}
                    className="text-center font-mono text-lg tracking-wider"
                  />
                </div>

                <Button 
                  onClick={handleRecharge}
                  disabled={processing || !rechargeCode.trim()}
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
                      <Wallet className="mr-2 h-4 w-4" />
                      Nạp tiền
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Mã nạp tiền có 8 ký tự</p>
                  <p>• Mỗi mã chỉ sử dụng được 1 lần</p>
                  <p>• Mã có hiệu lực trong 30 ngày</p>
                  <p>• Liên hệ admin để lấy mã nạp tiền</p>
                </div>
                
                {/* Thông tin liên hệ */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Liên hệ Admin:</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Facebook: 
                    <a 
                      href="https://www.facebook.com/profile.php?id=61578792454672" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Admin Yoga
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lịch sử giao dịch */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Lịch sử giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có giao dịch nào
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={transaction.type === 'recharge' ? 'default' : 'secondary'}>
                            {transaction.type === 'recharge' ? 'Nạp tiền' : 
                             transaction.type === 'purchase' ? 'Mua khóa học' : 'Hoàn tiền'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatDate(transaction.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {transaction.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${
                          transaction.amount_vnd > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount_vnd > 0 ? '+' : ''}{formatCurrency(transaction.amount_vnd)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
