import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  async function handleAuthCallback() {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Có lỗi xảy ra khi xác nhận email')
        return
      }

      if (data.session?.user) {
        setStatus('success')
        setMessage('Email đã được xác nhận thành công!')
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setStatus('error')
        setMessage('Không thể xác nhận email. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      setStatus('error')
      setMessage('Có lỗi xảy ra khi xác nhận email')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Xác nhận Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
              <p className="text-gray-600">Đang xác nhận email...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-green-700 font-medium">{message}</p>
              <p className="text-gray-600 text-sm">Chuyển hướng về trang chủ...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto" />
              <p className="text-red-700 font-medium">{message}</p>
              <Button 
                onClick={() => navigate('/login')}
                className="mt-4"
              >
                Quay về trang đăng nhập
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
