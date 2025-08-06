import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Quay về trang chủ
        </Link>
        
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                YogaFlow
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Tạo tài khoản</CardTitle>
            <CardDescription>
              Bắt đầu hành trình yoga của bạn ngay hôm nay
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="Họ"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Tên"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="0901 234 567"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Kinh nghiệm yoga</Label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Chọn trình độ của bạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Người mới bắt đầu</SelectItem>
                    <SelectItem value="intermediate">Trung cấp</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                    <SelectItem value="expert">Chuyên nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3 text-sm">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-purple-600 peer-checked:border-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <span className="text-gray-600 leading-5">
                    Tôi đồng ý với{" "}
                    <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 text-sm">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-purple-600 peer-checked:border-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <span className="text-gray-600 leading-5">
                    Nhận thông tin về khóa học mới và ưu đãi đặc biệt
                  </span>
                </label>
              </div>
              
              <Button className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Tạo tài khoản
              </Button>
            </form>
            
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                hoặc
              </span>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-11">
                <img src="/placeholder.svg" alt="Google" className="w-5 h-5 mr-2" />
                Đăng ký với Google
              </Button>
              <Button variant="outline" className="w-full h-11">
                <img src="/placeholder.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                Đăng ký với Facebook
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Đăng nhập ngay
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
