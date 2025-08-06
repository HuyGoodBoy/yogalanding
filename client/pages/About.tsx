import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Target,
  Users,
  Award,
  ArrowLeft,
  CheckCircle,
  Globe,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const stats = [
    { label: "Học viên", value: "10,000+", icon: Users },
    { label: "Khóa học", value: "50+", icon: Award },
    { label: "Giảng viên", value: "15+", icon: Heart },
    { label: "Quốc gia", value: "3", icon: Globe },
  ];

  const values = [
    {
      icon: Heart,
      title: "Tận tâm",
      description:
        "Chúng tôi luôn đặt sự hạnh phúc và sức khỏe của học viên lên hàng đầu trong mọi quyết định.",
    },
    {
      icon: Target,
      title: "Chuyên nghiệp",
      description:
        "Đội ngũ giảng viên được đào tạo bài bản với chứng chỉ quốc tế và kinh nghiệm thực tế.",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description:
        "Xây dựng một cộng đồng yoga gắn kết, nơi mọi người cùng học hỏi và phát triển.",
    },
    {
      icon: Zap,
      title: "Đổi mới",
      description:
        "Không ngừng cập nhật phương pháp giảng dạy và công nghệ để mang lại trải nghiệm tốt nhất.",
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Khởi đầu",
      description:
        "YogaFlow được thành lập với sứ mệnh democratize yoga education tại Việt Nam.",
    },
    {
      year: "2021",
      title: "Mở rộng",
      description:
        "Ra mắt 10 khóa học đầu tiên và thu hút 1,000 học viên trong năm đầu.",
    },
    {
      year: "2022",
      title: "Phát triển",
      description:
        "Mở rộng đội ngũ giảng viên và ra mắt app mobile, đạt 5,000 học viên.",
    },
    {
      year: "2023",
      title: "Quốc tế hóa",
      description:
        "Mở rộng ra các quốc gia Đông Nam Á và đạt mốc 10,000 học viên.",
    },
    {
      year: "2024",
      title: "Tương lai",
      description:
        "Tiếp tục phát triển với AI coaching và VR yoga experiences.",
    },
  ];

  const achievements = [
    "Top 1 Platform Yoga Online Việt Nam",
    "Giải thưởng 'Best EdTech Startup' 2023",
    "Chứng nhận ISO 9001:2015",
    "Đối tác chính thức của Yoga Alliance",
    "10,000+ học viên hài lòng",
    "4.9/5 đánh giá trung bình",
  ];

  return (
    <div className="min-h-screen bg-white">
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
              Quay về trang ch���
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
                🌟 Câu chuyện của chúng tôi
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Yoga cho
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {" "}
                  mọi người
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Chúng tôi tin rằng yoga không chỉ dành cho một nhóm người nào
                đó. Sứ mệnh của YogaFlow là làm cho yoga trở nên dễ tiếp cận,
                chất lượng và phù hợp với mọi người Việt Nam.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Tham gia cộng đồng
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Yoga community"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">10,000+</p>
                    <p className="text-sm text-gray-600">Học viên hạnh phúc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sứ mệnh
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Democratize việc tiếp cận yoga chất lượng cao cho mọi người
                  Việt Nam. Chúng tôi muốn phá bỏ rào cản về thời gian, địa điểm
                  và chi phí để mang yoga đến gần hơn với cuộc sống hàng ngày
                  của mọi người.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Tầm nhìn
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Trở thành platform yoga online số 1 Đông Nam Á, nơi mọi người
                  có thể tìm thấy sự cân bằng trong cuộc sống thông qua việc
                  thực hành yoga. Chúng tôi hướng tới một cộng đồng khỏe mạnh và
                  hạnh phúc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ một ý tưởng đơn giản đến platform yoga hàng đầu
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.year.slice(-2)}
                    </div>
                    <div className="ml-8 flex-1">
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {item.title}
                            </h3>
                            <Badge className="bg-purple-100 text-purple-700">
                              {item.year}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thành tựu & Chứng nhận
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những cột mốc đáng tự hào trong hành trình phát triển
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng tham gia hành trình cùng chúng tôi?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Trở thành một phần của cộng đồng yoga lớn nhất Việt Nam và khám phá
            tiềm năng bên trong bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Bắt đầu ngay hôm nay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Liên hệ với chúng tôi
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
                Yoga cho mọi người, mọi lúc, mọi nơi.
              </p>
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
                  <Link to="/instructors" className="hover:text-white">
                    Giảng viên
                  </Link>
                </li>
                <li>
                  <Link to="/live-classes" className="hover:text-white">
                    Live Classes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="hover:text-white">
                    Báo chí
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
                  <Link to="/community" className="hover:text-white">
                    Cộng đồng
                  </Link>
                </li>
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
