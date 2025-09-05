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
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use Supabase SDK for password reset (this doesn't require authentication)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset-custom`,
      });

      if (error) {
        toast.error(`Gửi email thất bại: ${error.message}`);
        return;
      }

      setEmailSent(true);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

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

            {!emailSent ? (
              <>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Quên mật khẩu?
                </CardTitle>
                <CardDescription>
                  Nhập email của bạn và chúng tôi sẽ gửi link để tạo mật khẩu
                  mới.
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Kiểm tra email
                </CardTitle>
                <CardDescription>
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
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
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi link đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử gửi
                  lại sau vài phút.
                </p>
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full h-11"
                >
                  Gửi lại email
                </Button>
              </div>
            )}

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
