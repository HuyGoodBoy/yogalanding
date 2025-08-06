import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  MessageCircle,
  Users,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ văn phòng",
      details: ["123 Đường Nguyễn Huệ, Quận 1", "TP. Hồ Chí Minh, Việt Nam"],
    },
    {
      icon: Phone,
      title: "Số điện thoại",
      details: ["Hotline: 1900 123 456", "Tư vấn: 028 1234 5678"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["hello@yogaflow.vn", "support@yogaflow.vn"],
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7 - CN: 9:00 - 17:00"],
    },
  ];

  const departments = [
    {
      name: "Tư vấn khóa học",
      description: "Hỗ trợ lựa chọn khóa học phù hợp",
      icon: Users,
    },
    {
      name: "Hỗ trợ kỹ thuật",
      description: "Giải quyết vấn đề về platform",
      icon: MessageCircle,
    },
    {
      name: "Hợp tác giảng viên",
      description: "Thông tin về việc trở thành giảng viên",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                YogaFlow
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Liên hệ với
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              chúng tôi
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ để được tư vấn về
            khóa học hoặc giải đáp mọi thắc mắc.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
                <p className="text-gray-600">
                  Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong vòng 24
                  giờ.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ *</Label>
                      <Input
                        id="firstName"
                        placeholder="Nhập họ của bạn"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên *</Label>
                      <Input
                        id="lastName"
                        placeholder="Nhập tên của bạn"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề *</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Chọn chủ đề bạn muốn liên hệ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course-consultation">
                          Tư vấn khóa học
                        </SelectItem>
                        <SelectItem value="technical-support">
                          Hỗ trợ kỹ thuật
                        </SelectItem>
                        <SelectItem value="instructor-partnership">
                          Hợp tác giảng viên
                        </SelectItem>
                        <SelectItem value="business-partnership">
                          Hợp tác doanh nghiệp
                        </SelectItem>
                        <SelectItem value="feedback">
                          Góp ý và phản hồi
                        </SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn *</Label>
                    <Textarea
                      id="message"
                      placeholder="Mô tả chi tiết về vấn đề hoặc yêu cầu của bạn..."
                      className="min-h-32"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="consent" className="text-sm text-gray-600">
                      Tôi đồng ý với việc YogaFlow sử dụng thông tin này để liên
                      hệ và hỗ trợ tôi.
                    </Label>
                  </div>

                  <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg">
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => (
                          <p
                            key={detailIndex}
                            className="text-gray-600 text-sm"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Support */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Hỗ trợ nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => {
                  const IconComponent = dept.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {dept.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {dept.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Theo dõi chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-12 p-2">
                    <img
                      src="/placeholder.svg"
                      alt="Facebook"
                      className="w-6 h-6"
                    />
                  </Button>
                  <Button variant="outline" className="h-12 p-2">
                    <img
                      src="/placeholder.svg"
                      alt="Instagram"
                      className="w-6 h-6"
                    />
                  </Button>
                  <Button variant="outline" className="h-12 p-2">
                    <img
                      src="/placeholder.svg"
                      alt="YouTube"
                      className="w-6 h-6"
                    />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Theo dõi chúng tôi để cập nhật những thông tin mới nhất về
                  yoga và sức khỏe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tìm chúng tôi
            </h2>
            <p className="text-gray-600">
              Văn phòng chính tại trung tâm thành phố
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Bản đồ sẽ được hiển thị ở đây</p>
              <p className="text-sm text-gray-400">
                123 Đường Nguyễn Huệ, Quận 1, TP.HCM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600">Những thắc mắc phổ biến từ học viên</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Làm thế nào để đăng ký khóa học?",
                answer:
                  "Bạn có thể đăng ký trực tiếp trên website hoặc liên hệ hotline 1900 123 456 để được hỗ trợ.",
              },
              {
                question: "Tôi có thể học lại bài đã học không?",
                answer:
                  "Có, bạn có thể truy cập và học lại bất kỳ bài nào trong khóa học của mình không giới hạn số lần.",
              },
              {
                question: "Có chính sách hoàn tiền không?",
                answer:
                  "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày đầu nếu bạn không hài lòng.",
              },
              {
                question: "Tôi cần thiết bị gì để tập yoga?",
                answer:
                  "Bạn chỉ cần một tấm thảm yoga và không gian thoải mái. Các dụng cụ khác sẽ được hướng dẫn trong từng bài học.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/help">Xem tất cả câu hỏi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <span className="text-xl font-bold">YogaFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Kết nối với chúng tôi để bắt đầu hành trình yoga của bạn.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-white">
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link to="/instructors" className="hover:text-white">
                    Giảng viên
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 hello@yogaflow.vn</li>
                <li>📞 1900 123 456</li>
                <li>📍 123 Nguyễn Huệ, Q1, HCM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YogaFlow. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
