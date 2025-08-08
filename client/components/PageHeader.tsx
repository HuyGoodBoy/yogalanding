import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { ArrowLeft, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface PageHeaderProps {
  title: string
  description?: string
  backUrl?: string
  backText?: string
  showLogout?: boolean
}

export default function PageHeader({ 
  title, 
  description, 
  backUrl, 
  backText = "Về trang chủ",
  showLogout = true 
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        {backUrl && (
          <Button 
            variant="ghost" 
            onClick={() => navigate(backUrl)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Button>
        )}
        
        {showLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Đăng xuất
          </Button>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  )
}
