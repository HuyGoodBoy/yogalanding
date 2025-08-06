import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Users,
  Award,
  Calendar,
  ArrowLeft,
  MapPin,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Instructors() {
  const instructors = [
    {
      id: 1,
      name: "Nguyễn Thị Linh",
      title: "Founder & Lead Instructor",
      speciality: "Hatha Yoga, Vinyasa Flow",
      experience: "8 năm",
      certification: "RYT-500, E-RYT-200",
      students: "5,000+",
      rating: 4.9,
      location: "Hồ Chí Minh",
      bio: "Linh đã dành 8 năm để nghiên cứu và giảng dạy yoga. Cô tin rằng yoga không chỉ là việc tập luyện thể chất mà còn là hành trình khám phá bản thân.",
      avatar: "/placeholder.svg",
      courses: ["Yoga Cơ Bản", "Hatha Yoga Nâng Cao", "Morning Flow"],
      languages: ["Tiếng Việt", "English"],
      achievements: [
        "Chứng chỉ Yoga Alliance RYT-500",
        "Hoàn thành khóa đào tạo tại Rishikesh, Ấn Độ",
        "Giải thưởng 'Giảng viên Yoga xuất sắc' 2023",
      ],
    },
    {
      id: 2,
      name: "Trần Minh Đức",
      title: "Senior Yoga Instructor",
      speciality: "Yin Yoga, Meditation",
      experience: "6 năm",
      certification: "RYT-300, Yin Yoga Teacher",
      students: "3,200+",
      rating: 4.8,
      location: "Hà Nội",
      bio: "Đức chuyên về Yin Yoga và thiền định. Anh mang đến những bài tập sâu sắc giúp học viên tìm thấy sự bình an trong tâm hồn.",
      avatar: "/placeholder.svg",
      courses: [
        "Yin Yoga Healing",
        "Mindfulness Meditation",
        "Stress Relief Yoga",
      ],
      languages: ["Tiếng Việt", "English"],
      achievements: [
        "Chứng chỉ Yin Yoga từ Bernie Clark",
        "Hoàn thành khóa Vipassana 10 ngày",
        "Tác giả sách 'Yoga và Thiền trong cuộc sống'",
      ],
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      title: "Prenatal Yoga Specialist",
      speciality: "Prenatal Yoga, Postnatal Recovery",
      experience: "5 năm",
      certification: "Prenatal Yoga Certified, RYT-200",
      students: "2,800+",
      rating: 4.9,
      location: "Đà Nẵng",
      bio: "Hương chuyên về yoga cho phụ nữ mang thai và phục hồi sau sinh. Cô đã giúp hàng nghìn mẹ bầu có thai kỳ khỏe mạnh và hạnh phúc.",
      avatar: "/placeholder.svg",
      courses: ["Prenatal Yoga", "Postnatal Recovery", "Family Yoga"],
      languages: ["Tiếng Việt"],
      achievements: [
        "Chứng chỉ Prenatal Yoga quốc tế",
        "Chuyên gia tư vấn thai kỳ",
        "Diễn giả hội thảo 'Yoga cho mẹ và bé'",
      ],
    },
    {
      id: 4,
      name: "Phạm Văn Tâm",
      title: "Power Yoga Instructor",
      speciality: "Power Yoga, Ashtanga",
      experience: "7 năm",
      certification: "Ashtanga Authorized, RYT-500",
      students: "4,100+",
      rating: 4.8,
      location: "Hồ Chí Minh",
      bio: "Tâm là chuyên gia về Power Yoga và Ashtanga. Anh mang đến những bài tập năng động giúp học viên phát triển sức mạnh và sự kiên nhẫn.",
      avatar: "/placeholder.svg",
      courses: ["Power Yoga", "Ashtanga Primary Series", "Advanced Vinyasa"],
      languages: ["Tiếng Việt", "English"],
      achievements: [
        "Được ủy quyền giảng dạy Ashtanga",
        "10 năm tập luyện Ashtanga",
        "Huấn luyện viên thể hình chuyển sang Yoga",
      ],
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
            Đội ngũ giảng viên
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              chuyên nghiệp
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gặp gỡ những giảng viên yoga tài năng và giàu kinh nghiệm, những
            người sẽ đồng hành cùng bạn trong hành trình khám phá sức mạnh bên
            trong.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {instructors.map((instructor) => (
              <Card
                key={instructor.id}
                className="group hover:shadow-xl transition-all duration-300 border-gray-100"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6 mb-6">
                    <Avatar className="w-24 h-24 ring-4 ring-purple-100">
                      <AvatarImage
                        src={instructor.avatar}
                        alt={instructor.name}
                      />
                      <AvatarFallback className="text-xl">
                        {instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {instructor.name}
                      </h3>
                      <p className="text-purple-600 font-semibold mb-1">
                        {instructor.title}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {instructor.speciality}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {instructor.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {instructor.experience}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {instructor.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-bold text-lg">
                          {instructor.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Đánh giá</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="font-bold text-lg">
                          {instructor.students}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Học viên</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Award className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-bold text-lg">
                          {instructor.courses.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Khóa học</p>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Khóa học giảng dạy:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {instructor.courses.map((course, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-purple-200 text-purple-700"
                        >
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Chứng chỉ & Thành tựu:
                    </h4>
                    <ul className="space-y-1">
                      {instructor.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Ngôn ngữ giảng dạy:
                    </h4>
                    <div className="flex space-x-2">
                      {instructor.languages.map((language, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Xem khóa học
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Liên hệ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bạn có muốn gia nhập đội ngũ của chúng tôi?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Chúng tôi luôn tìm kiếm những giảng viên yoga tài năng và đam mê để
            mở rộng đội ngũ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Ứng tuyển ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
            >
              Tìm hiểu thêm
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
                Platform yoga online hàng đầu Việt Nam với đội ngũ giảng viên
                chuyên nghiệp.
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
              <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
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
