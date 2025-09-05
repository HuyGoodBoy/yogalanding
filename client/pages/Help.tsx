import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ArrowLeft,
  HelpCircle,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: BookOpen,
      title: "Bắt đầu",
      description: "Hướng dẫn cho người mới",
      count: 8,
    },
    {
      icon: CreditCard,
      title: "Thanh toán",
      description: "Thanh toán và hoàn tiền",
      count: 6,
    },
    {
      icon: Settings,
      title: "Tài khoản",
      description: "Quản lý tài khoản",
      count: 10,
    },
    {
      icon: Users,
      title: "Khóa học",
      description: "Về các khóa học",
      count: 12,
    },
  ];

  const faqs = [
    {
      category: "Bắt đầu",
      question: "Làm thế nào để tạo tài khoản?",
      answer:
        "Bạn có thể tạo tài khoản bằng cách nhấn vào nút 'Đăng ký' ở góc phải trên cùng của trang web. Điền thông tin cá nhân và xác nhận email để hoàn tất việc đăng ký.",
    },
    {
      category: "Bắt đầu",
      question: "Tôi cần chuẩn bị gì để bắt đầu học yoga?",
      answer:
        "Bạn chỉ cần một tấm thảm yoga, quần áo thoải mái và không gian yên tĩnh. Tất cả các khóa học đều được thiết kế cho người mới bắt đầu.",
    },
    {
      category: "Bắt đầu",
      question: "Khóa học nào phù hợp cho người mới bắt đầu?",
      answer:
        "Chúng tôi khuyên bạn nên bắt đầu với khóa 'Yoga Cơ Bản' - được thiết kế đặc biệt cho những người chưa từng tập yoga.",
    },
    {
      category: "Thanh toán",
      question: "Tôi có thể thanh toán bằng những phương thức nào?",
      answer:
        "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng, và các ví điện tử như MoMo, ZaloPay.",
    },
    {
      category: "Thanh toán",
      question: "Chính sách hoàn tiền như thế nào?",
      answer:
        "Chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với khóa học. Liên hệ support để được hỗ trợ.",
    },
    {
      category: "Thanh toán",
      question: "Tôi có thể hủy đăng ký bất cứ lúc nào không?",
      answer:
        "Có, bạn có thể hủy đăng ký bất cứ lúc nào từ trang quản lý tài khoản. Việc hủy sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.",
    },
    {
      category: "Tài khoản",
      question: "Làm thế nào để thay đổi mật khẩu?",
      answer:
        "Vào 'Cài đặt tài khoản' > 'Bảo mật' > 'Đổi mật khẩu'. Nhập mật khẩu hiện tại và mật khẩu mới, sau đó nhấn 'Cập nhật'.",
    },
    {
      category: "Tài khoản",
      question: "Tôi quên mật khẩu, phải làm sao?",
      answer:
        "Nhấn vào 'Quên mật khẩu?' trên trang đăng nhập, nhập email của bạn và chúng tôi sẽ gửi link để tạo mật khẩu mới.",
    },
    {
      category: "Tài khoản",
      question: "Làm thế nào để cập nhật thông tin cá nhân?",
      answer:
        "Vào 'Cài đặt tài khoản' > 'Thông tin cá nhân' để cập nhật họ tên, số điện thoại, địa chỉ và các thông tin khác.",
    },
    {
      category: "Khóa học",
      question: "Tôi có thể học lại bài đã xem không?",
      answer:
        "Có, bạn có thể xem lại bất kỳ bài học nào trong khóa học đã đăng ký không giới hạn số lần và suốt đời.",
    },
    {
      category: "Khóa học",
      question: "Làm thế nào để tải xuống chứng chỉ?",
      answer:
        "Sau khi hoàn thành 100% khóa học, chứng chỉ sẽ xuất hiện trong phần 'Thành tích' của tài khoản. Bạn có thể tải xuống định dạng PDF.",
    },
    {
      category: "Khóa học",
      question: "Tôi có thể học trên điện thoại không?",
      answer:
                        "Có, website của chúng tôi tối ưu cho mọi thiết bị. Bạn cũng có thể tải app Yoga Thuý An trên App Store hoặc Google Play.",
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Chat trực tuyến",
      description: "Phản hồi ngay lập tức",
      action: "Bắt đầu chat",
      available: "24/7",
    },
    {
      icon: Mail,
      title: "Email hỗ trợ",
              description: "support@thuyanyoga.vn",
      action: "Gửi email",
      available: "Phản hồi trong 24h",
    },
    {
      icon: Phone,
      title: "Hotline",
      description: "1900 123 456",
      action: "Gọi ngay",
      available: "8:00 - 22:00",
    },
  ];

  const filteredFaqs = (category: string) => {
    return faqs.filter((faq) => faq.category === category);
  };

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trung tâm
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              trợ giúp
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Tìm câu trả lời cho mọi thắc mắc về Yoga Thuý An. Chúng tôi ở đây để hỗ
            trợ bạn.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Cần hỗ trợ ngay?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {option.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {option.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              {option.action}
                            </Button>
                            <span className="text-xs text-gray-500">
                              {option.available}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {category.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="getting-started">Bắt đầu</TabsTrigger>
                <TabsTrigger value="billing">Thanh toán</TabsTrigger>
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="courses">Khóa học</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Câu hỏi thường gặp
                  </h2>
                  {faqs.map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardContent className="p-0">
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === index ? null : index)
                          }
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs">
                              {faq.category}
                            </Badge>
                            <h3 className="font-semibold text-gray-900">
                              {faq.question}
                            </h3>
                          </div>
                          {openFaq === index ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {openFaq === index && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="getting-started">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Hướng dẫn bắt đầu
                  </h2>
                  {filteredFaqs("Bắt đầu").map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Thanh toán & Hoàn tiền
                  </h2>
                  {filteredFaqs("Thanh toán").map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="account">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Quản lý tài khoản
                  </h2>
                  {filteredFaqs("Tài khoản").map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Về khóa học
                  </h2>
                  {filteredFaqs("Khóa học").map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Still Need Help */}
            <Card className="border-0 shadow-xl mt-12 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Vẫn cần hỗ trợ thêm?
                </h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy câu trả lời? Đội ngũ hỗ trợ của chúng tôi luôn
                  sẵn sàng giúp bạn.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Link to="/contact">Liên hệ hỗ trợ</Link>
                  </Button>
                  <Button variant="outline">Gọi hotline: 0902200177</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                        <img src="/logo.jpg" alt="Yoga Thuý An" className="w-8 h-8 rounded-full object-cover" />
        <span className="text-xl font-bold">Yoga Thuý An</span>
              </div>
              <p className="text-gray-400 mb-4">
                Luôn ở đây để hỗ trợ hành trình yoga của bạn.
              </p>
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
                  <Link to="/community" className="hover:text-white">
                    Cộng đồng
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/courses" className="hover:text-white">
                    Khóa học
                  </Link>
                </li>

                <li>
                  <Link to="/live" className="hover:text-white">
                    Live Classes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  24/7 Hỗ trợ
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  0902200177
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  yogathuyan.vn@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Yoga Thuý An. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
