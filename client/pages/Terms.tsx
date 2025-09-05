import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Yoga Thuý An" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yoga Thuý An
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="mr-2" size={20} />
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-gray-900">
                Điều khoản sử dụng
              </CardTitle>
              <p className="text-gray-600">Cập nhật lần cuối: 15/12/2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Trang này hiện đang được phát triển. Chúng tôi đang chuẩn bị nội
                dung chi tiết về điều khoản sử dụng dịch vụ Yoga Thuý An.
              </p>

              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Trang đang được phát triển
                </h3>
                <p className="text-gray-600 mb-6">
                  Nội dung đầy đủ về điều khoản sử dụng sẽ sớm được cập nhật.
                  Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Link to="/contact">Liên hệ hỗ trợ</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Quay về trang chủ</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
