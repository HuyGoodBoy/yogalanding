import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Play,
  Users,
  Clock,
  Award,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  Wallet,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useEnrollments } from "@/hooks/use-enrollments";
import { toast } from "sonner";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { isEnrolledInCourseBySlug } = useEnrollments();
  const navigate = useNavigate();

  const handleChoosePlan = (planName: string) => {
    if (user) {
      // Nếu đã đăng nhập, chuyển đến trang thanh toán subscription
      navigate('/subscription-payment', { 
        state: { 
          plan: planName,
          amount: planName === 'Cơ bản' ? 299000 : planName === 'Pro' ? 599000 : 999000
        } 
      });
    } else {
      // Nếu chưa đăng nhập, chuyển đến trang đăng ký
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Thuý An yoga" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thuý An yoga
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#courses"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Khóa học
              </a>

              <a
                href="#testimonials"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Đánh giá
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Giá cả
              </a>
              
              {/* Cart Icon */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {totalItems}
                  </Badge>
                )}
              </Link>
              
              {/* Recharge Link */}
              {user && (
                <Link to="/recharge" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                  <Wallet className="w-5 h-5" />
                  <span className="hidden md:block">Nạp tiền</span>
                </Link>
              )}
              
              {/* User Menu Links */}
              {user && (
                <>
                  <Link to="/my-courses" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                    <BookOpen className="w-5 h-5" />
                    <span className="hidden md:block">Khóa học của tôi</span>
                  </Link>
                  <Link to="/transaction-history" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                    <Wallet className="w-5 h-5" />
                    <span className="hidden md:block">Lịch sử giao dịch</span>
                  </Link>
                  <Link to="/admin" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                    <Users className="w-5 h-5" />
                    <span className="hidden md:block">Admin</span>
                  </Link>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Xin chào, {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await signOut();
                        toast.success('Đăng xuất thành công!');
                        navigate('/');
                      } catch (error) {
                        toast.error('Có lỗi xảy ra khi đăng xuất');
                      }
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    asChild
                  >
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    asChild
                  >
                    <Link to="/register">Dùng thử miễn phí</Link>
                  </Button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-purple-100 pt-4">
              <div className="flex flex-col space-y-4">
                <a
                  href="#courses"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Khóa học
                </a>

                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Đánh giá
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Giá cả
                </a>
                
                {/* Mobile Cart */}
                <Link to="/cart" className="flex items-center text-gray-700 hover:text-purple-600 transition-colors">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Giỏ hàng
                  {totalItems > 0 && (
                    <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
                
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-600">
                      Xin chào, {user.email}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await signOut();
                          toast.success('Đăng xuất thành công!');
                          navigate('/');
                        } catch (error) {
                          toast.error('Có lỗi xảy ra khi đăng xuất');
                        }
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      asChild
                    >
                      <Link to="/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      asChild
                    >
                      <Link to="/register">Dùng thử miễn phí</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
                🧘‍♀️ Thuý An yoga - Platform Yoga Online #1 Việt Nam
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Khám phá sức mạnh
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {" "}
                  Yoga{" "}
                </span>
                cùng chúng tôi
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tham gia hàng nghìn học viên đã thay đổi cuộc sống với các khóa
                học yoga online chất lượng cao. Từ cơ bản đến nâng cao, phù hợp
                với mọi trình độ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3"
                  asChild
                >
                  <Link to="/register">
                    Bắt đầu ngay hôm nay
                    <ChevronRight className="ml-2" size={20} />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 text-lg px-8 py-3"
                  asChild
                >
                  <Link to="/about">
                    <Play className="mr-2" size={20} />
                    Xem video giới thiệu
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="mr-2" size={16} />
                  10,000+ học viên
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 text-yellow-500" size={16} />
                  4.9/5 đánh giá
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                  <img
                    src="/images.jpg"
                    alt="Yoga instructor"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900">
                      Live Class đang diễn ra
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Hatha Yoga cho người mới bắt đầu
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-pink-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-indigo-400 rounded-full border-2 border-white"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        +247 đang tham gia
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chọn khóa học phù hợp với trình độ và mục tiêu của bạn
            </p>
          </div>

          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
            </div>
          ) : coursesError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Có lỗi xảy ra khi tải khóa học: {coursesError}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không có khóa học nào được tìm thấy</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-xl transition-all duration-300 border-gray-100 hover:-translate-y-2"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.thumbnail_url || "/download.jpg"}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-purple-700">
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mb-4">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {course.duration_weeks} tuần
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        {course.instructor}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        {course.price_vnd.toLocaleString('vi-VN')}₫
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-gray-600">4.9</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    {isEnrolledInCourseBySlug(course.slug) ? (
                      <div className="w-full">
                        <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-200">
                          Đã sở hữu
                        </Badge>
                        <Button
                          className="w-full mt-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                          asChild
                        >
                          <Link to={`/course/${course.slug}`}>Xem khóa học</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        asChild
                      >
                        <Link to={`/course/${course.slug}`}>Đăng ký ngay</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Thuý An yoga?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Play className="w-8 h-8 text-purple-600" />,
                title: "Video HD chất lượng cao",
                description:
                  "Tất cả video đều được quay với chất lượng 4K, âm thanh rõ ràng",
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Cộng đồng hỗ trợ",
                description:
                  "Tham gia cộng đồng 10,000+ học viên, chia sẻ kinh nghiệm",
              },
              {
                icon: <Clock className="w-8 h-8 text-purple-600" />,
                title: "Học mọi lúc mọi nơi",
                description:
                  "Truy cập trên mọi thiết bị, học theo lịch trình của bạn",
              },
              {
                icon: <Award className="w-8 h-8 text-purple-600" />,
                title: "Chứng chỉ hoàn thành",
                description: "Nhận chứng chỉ sau khi hoàn thành khóa học",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Học viên nói gì về chúng tôi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Thị Mai",
                role: "Nhân viên văn phòng",
                content:
                  "Tôi đã thực hành yoga được 6 tháng và cảm thấy cơ thể linh hoạt hơn rất nhiều. Các bài học rất dễ hiểu và thầy cô rất tận tâm.",
                rating: 5,
                avatar: "/human1.jpg",
              },
              {
                name: "Trần Văn Nam",
                role: "Kỹ sư IT",
                content:
                  "Công việc căng thẳng nhưng từ khi học yoga online tại đây, tôi cảm thấy tinh thần thư thái và tập trung hơn. Rất đáng đầu tư!",
                rating: 5,
                avatar: "/human3.webp",
              },
              {
                name: "Lê Thị Hương",
                role: "Giáo viên",
                content:
                  "Khóa học Vinyasa Flow thật tuyệt vời! Tôi có thể học theo tốc độ của mình và các video rất chất lượng. Highly recommended!",
                rating: 5,
                avatar: "/human2.jpeg",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-gray-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-16 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Chọn gói phù hợp với bạn
            </h2>
            <p className="text-xl text-gray-600">
              Bắt đầu với bản dùng thử miễn phí 7 ngày
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Cơ bản",
                price: "299,000₫",
                period: "/tháng",
                features: [
                  "Truy cập 50+ video bài tập",
                  "Hỗ trợ qua email",
                  "Học theo tốc độ riêng",
                  "Chất lượng HD",
                ],
              },
              {
                name: "Pro",
                price: "599,000₫",
                period: "/tháng",
                popular: true,
                features: [
                  "Truy cập toàn bộ khóa học",
                  "Live class hàng tuần",
                  "Hỗ trợ 1-1 với giảng viên",
                  "Chất lượng 4K",
                  "Chứng chỉ hoàn thành",
                  "Cộng đồng riêng",
                ],
              },
              {
                name: "Premium",
                price: "999,000₫",
                period: "/tháng",
                features: [
                  "Tất cả tính năng Pro",
                  "Khóa học riêng 1-1",
                  "Tư vấn dinh dưỡng",
                  "Kế hoạch tập luyện cá nhân",
                  "Hỗ trợ 24/7",
                  "Ưu tiên tham gia workshop",
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-purple-500 border-2 scale-105" : "border-gray-200"} hover:shadow-xl transition-all`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                    Phổ biến nhất
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => handleChoosePlan(plan.name)}
                  >
                    Chọn gói này
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình yoga của bạn?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học viên đã thay đổi cuộc sống với yoga.
            Dùng thử miễn phí 7 ngày, không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3"
              asChild
            >
              <Link to="/register">Dùng thử miễn phí 7 ngày</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3"
              asChild
            >
              <Link to="/about">Tìm hiểu thêm</Link>
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
                <img src="/logo.jpg" alt="Thuý An yoga" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-xl font-bold">Thuý An yoga</span>
              </div>
              <p className="text-gray-400 mb-4">
                Thuý An yoga - Platform yoga online hàng đầu Việt Nam, mang đến trải nghiệm tập
                luyện tuyệt vời nhất.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Khóa học</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/course/yoga-co-ban" className="hover:text-white">
                    Yoga cơ bản
                  </Link>
                </li>
                <li>
                  <Link to="/course/hatha-yoga-nang-cao" className="hover:text-white">
                    Hatha Yoga
                  </Link>
                </li>
                <li>
                  <Link to="/course/vinyasa-flow" className="hover:text-white">
                    Vinyasa Flow
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
                  <Link to="/help" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white">
                    Chính sách hoàn tiền
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Thuý An yoga. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
