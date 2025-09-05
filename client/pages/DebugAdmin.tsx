import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function DebugAdmin() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [targetUserId, setTargetUserId] = useState('')
  const [settingAdmin, setSettingAdmin] = useState(false)

  // Helper function để lấy access token
  const getAccessToken = () => {
    try {
      const token = localStorage.getItem('supabase.auth.token')
      if (!token) return null
      
      const tokenData = JSON.parse(token)
      return tokenData?.currentSession?.access_token
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }

  // Lấy debug info từ database
  const fetchDebugInfo = async () => {
    try {
      setLoading(true)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/debug_admin_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Set user as admin
  const setUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      setSettingAdmin(true)

      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/set_user_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          p_user_id: userId,
          p_is_admin: isAdmin
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        // Refresh debug info
        await fetchDebugInfo()
      } else {
        toast.error(data.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
      toast.error(errorMessage)
    } finally {
      setSettingAdmin(false)
    }
  }

  // Load debug info on mount
  useEffect(() => {
    if (user) {
      fetchDebugInfo()
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bạn cần đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để truy cập trang debug</CardDescription>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Debug Admin Status</h1>
              <p className="text-gray-600">Kiểm tra và quản lý trạng thái admin</p>
            </div>
          </div>
          <Button
            onClick={fetchDebugInfo}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Current User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Thông tin User hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Profile từ AuthContext</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">is_admin:</span>
                        <Badge variant={profile?.is_admin ? "default" : "secondary"}>
                          {profile?.is_admin ? 'true' : 'false'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">role:</span>
                        <Badge variant={profile?.role === 'admin' ? "default" : "secondary"}>
                          {profile?.role || 'null'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Profile tồn tại</Label>
                    <div className="flex items-center space-x-2">
                      {profile ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">{profile ? 'Có' : 'Không'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Thông tin từ Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
              ) : debugInfo ? (
                <div className="space-y-4">
                  {debugInfo.success ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Email từ DB</Label>
                          <p className="text-sm text-gray-600">{debugInfo.debug_info.email}</p>
                        </div>
                        <div>
                          <Label>Full Name từ DB</Label>
                          <p className="text-sm text-gray-600">{debugInfo.debug_info.full_name || 'Chưa set'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>is_admin field</Label>
                          <Badge variant={debugInfo.debug_info.is_admin_field ? "default" : "secondary"}>
                            {debugInfo.debug_info.is_admin_field ? 'true' : 'false'}
                          </Badge>
                        </div>
                        <div>
                          <Label>role field</Label>
                          <Badge variant={debugInfo.debug_info.role_field === 'admin' ? "default" : "secondary"}>
                            {debugInfo.debug_info.role_field}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>is_admin() function result</Label>
                          <div className="flex items-center space-x-2">
                            {debugInfo.debug_info.is_admin_function_result ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Badge variant={debugInfo.debug_info.is_admin_function_result ? "default" : "secondary"}>
                              {debugInfo.debug_info.is_admin_function_result ? 'true' : 'false'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label>Profile tồn tại trong DB</Label>
                          <div className="flex items-center space-x-2">
                            {debugInfo.debug_info.profile_exists ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">{debugInfo.debug_info.profile_exists ? 'Có' : 'Không'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <AlertCircle className="h-5 w-5 inline mr-2" />
                      {debugInfo.error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có thông tin debug</p>
                  <Button onClick={fetchDebugInfo} className="mt-4">
                    Tải thông tin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Set Admin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Set Admin cho User khác
              </CardTitle>
              <CardDescription>
                Nhập User ID để set admin (chỉ admin mới có thể thực hiện)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="Nhập UUID của user"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setUserAdmin(targetUserId, true)}
                    disabled={!targetUserId || settingAdmin}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {settingAdmin ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Set Admin
                  </Button>
                  <Button
                    onClick={() => setUserAdmin(targetUserId, false)}
                    disabled={!targetUserId || settingAdmin}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
