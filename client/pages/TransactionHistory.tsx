import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useBalance } from '../hooks/use-balance'
import { useEnrollments } from '../hooks/use-enrollments'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ArrowLeft, Wallet, ShoppingCart, CheckCircle, Clock, Calendar, DollarSign, BookOpen } from 'lucide-react'

export default function TransactionHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { balance, transactions } = useBalance()
  const { enrollments } = useEnrollments()
  
  const [activeTab, setActiveTab] = useState('transactions')

  // Format số tiền với dấu chấm
  const formatDisplayAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN')
  }

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Lọc giao dịch theo loại
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'recharge':
        return 'Nạp tiền'
      case 'purchase':
        return 'Mua khóa học'
      case 'subscription':
        return 'Đăng ký gói'
      default:
        return type
    }
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <Wallet className="w-4 h-4" />
      case 'purchase':
        return <ShoppingCart className="w-4 h-4" />
      case 'subscription':
        return <BookOpen className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'recharge':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'purchase':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'subscription':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để xem lịch sử giao dịch</CardDescription>
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          <p className="text-gray-600 mt-2">Xem tất cả giao dịch và khóa học đã mua</p>
        </div>

        {/* Thông tin tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Số dư hiện tại</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatDisplayAmount(balance?.balance_vnd || 0)} VND
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng giao dịch</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {transactions?.length || 0}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Khóa học đã mua</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {enrollments?.length || 0}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
            <TabsTrigger value="enrollments">Khóa học đã mua</TabsTrigger>
          </TabsList>

          {/* Tab Lịch sử giao dịch */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>Tất cả giao dịch nạp tiền và mua khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                              {getTransactionTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {getTransactionTypeLabel(transaction.type)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.description || 'Không có mô tả'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(transaction.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatDisplayAmount(transaction.amount)} VND
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có giao dịch nào</p>
                    <Button 
                      onClick={() => navigate('/recharge')}
                      className="mt-4"
                    >
                      Nạp tiền ngay
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Khóa học đã mua */}
          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Khóa học đã mua</CardTitle>
                <CardDescription>Tất cả khóa học bạn đã đăng ký</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments && enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">
                                {enrollment.courses?.title || 'Khóa học không tên'}
                              </h3>
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã mua
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600">
                              {enrollment.courses?.description || 'Không có mô tả'}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Đăng ký: {formatDate(enrollment.created_at)}</span>
                              <span>{enrollment.courses?.price_vnd?.toLocaleString('vi-VN')}₫</span>
                            </div>
                            
                            <Button 
                              className="w-full"
                              onClick={() => navigate(`/course/${enrollment.courses?.slug}`)}
                            >
                              Xem khóa học
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có khóa học nào</p>
                    <Button 
                      onClick={() => navigate('/')}
                      className="mt-4"
                    >
                      Khám phá khóa học
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
