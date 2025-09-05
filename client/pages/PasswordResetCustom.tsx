import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PasswordResetCustom() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      // Debug: Log all URL information
      console.log("Current URL:", window.location.href);
      console.log("Search params:", window.location.search);
      console.log("Hash:", window.location.hash);
      
      // Parse hash fragment for Supabase auth data
      const hash = window.location.hash.substring(1); // Remove #
      const hashParams = new URLSearchParams(hash);
      
      console.log("Hash params:", Object.fromEntries(hashParams));
      
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const tokenType = hashParams.get("token_type");
      const type = hashParams.get("type");
      const expiresAt = hashParams.get("expires_at");
      
      console.log("Auth data from hash:", { 
        accessToken: accessToken ? "exists" : "null", 
        refreshToken: refreshToken ? "exists" : "null",
        tokenType, 
        type, 
        expiresAt 
      });
      
      if (!accessToken || type !== "recovery") {
        toast.error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
        navigate("/forgot-password");
        return;
      }
      
      // Check if token is expired
      if (expiresAt) {
        const expiresTime = parseInt(expiresAt) * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        if (currentTime > expiresTime) {
          toast.error("Link đặt lại mật khẩu đã hết hạn");
          navigate("/forgot-password");
          return;
        }
      }

      try {
        // Set the session directly from hash data
        const sessionData = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          token_type: tokenType
        };

        // Store session data
        localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
        
        // Set the session in Supabase client
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        console.log("Session set result:", { data, error });

        if (error) {
          console.error("Session setting failed:", error);
          toast.error(`Không thể thiết lập session: ${error.message}`);
          navigate("/forgot-password");
        } else {
          setTokenValid(true);
          toast.success("Xác thực thành công, bạn có thể đặt mật khẩu mới");
        }
      } catch (error) {
        console.error("Error setting session:", error);
        toast.error("Có lỗi xảy ra khi xác thực");
        navigate("/forgot-password");
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase SDK
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error(`Cập nhật mật khẩu thất bại: ${error.message}`);
        return;
      }

      setSuccess(true);
      toast.success("Mật khẩu đã được đặt lại thành công!");
      
      // Clear stored session
      localStorage.removeItem('supabase.auth.token');
      
      // Sign out the user
      await supabase.auth.signOut();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Thành công!
              </CardTitle>
              <CardDescription>
                Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Đăng nhập ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Quay lại đăng nhập
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/logo.jpg" alt="Yoga Thuý An" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yoga Thuý An
              </span>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">
              Đặt lại mật khẩu
            </CardTitle>
            <CardDescription>
              Nhập mật khẩu mới của bạn
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Nhớ mật khẩu?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
