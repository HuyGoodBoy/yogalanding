import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star, Play, Users, Clock, Award, ChevronRight, ArrowLeft, Calendar, CheckCircle, Globe, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function CourseDetail() {
  const { courseId } = useParams();
  
  // Mock course data - in real app this would come from API
  const course = {
    id: courseId || "1",
    title: "Yoga Cơ Bản",
    subtitle: "Khóa học dành cho người mới bắt đầu",
    description: "Khóa học yoga cơ bản được thiết kế đặc biệt cho những người mới bắt đầu hành trình yoga. Bạn sẽ học được các tư thế cơ bản, kỹ thuật hô hấp, và cách thư giãn đúng cách.",
    instructor: "Nguyễn Thị Linh",
    instructorBio: "Giảng viên yoga với 8 năm kinh nghiệm, chứng chỉ quốc tế RYT-500",
    price: "999,000₫",
    originalPrice: "1,299,000₫",
    duration: "8 tuần",
    lessons: 24,
    students: "2,450",
    rating: 4.9,
    reviews: 312,
    level: "Cơ bản",
    language: "Tiếng Việt",
    certificate: true,
    image: "/placeholder.svg",
    features: [
      "24 video bài học chất lượng HD",
      "Tài liệu PDF hướng dẫn chi tiết",
      "Hỗ trợ trực tuyến từ giảng viên",
      "Chứng chỉ hoàn thành khóa học",
      "Truy cập suốt đời",
      "Cộng đồng học viên riêng"
    ],
    curriculum: [
      {
        week: 1,
        title: "Tuần 1: Làm quen với Yoga",
        lessons: [
          "Giới thiệu về Yoga và lợi ích",
          "Chuẩn bị không gian tập luyện",
          "Các tư thế cơ bản đầu tiên"
        ]
      },
      {
        week: 2,
        title: "Tuần 2: Hô hấp và Thư giãn",
        lessons: [
          "Kỹ thuật hô hấp Pranayama",
          "Tư thế thiền cơ bản",
          "Thư giãn toàn thân"
        ]
      },
      {
        week: 3,
        title: "Tuần 3: Tư thế đứng",
        lessons: [
          "Mountain Pose và Tree Pose",
          "Warrior I và Warrior II",
          "Triangle Pose"
        ]
      }
    ]
  };

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
            <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600">
              <ArrowLeft className="mr-2" size={20} />
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-purple-100 text-purple-700">{course.level}</Badge>
                <Badge variant="outline">{course.language}</Badge>
                {course.certificate && (
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    <Award className="w-3 h-3 mr-1" />
                    Có chứng chỉ
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="ml-1">({course.reviews} đánh giá)</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students} học viên
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>NL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor}</p>
                  <p className="text-sm text-gray-600">{course.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Course Video */}
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Play className="mr-2" size={20} />
                  Xem video giới thiệu
                </Button>
              </div>
            </div>

            {/* Course Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="curriculum">Chương trình</TabsTrigger>
                <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Về khóa học này</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Bạn sẽ học được gì:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chương trình học</CardTitle>
                    <CardDescription>
                      {course.lessons} bài học • {course.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.curriculum.map((week, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{week.title}</h4>
                          <ul className="space-y-2">
                            {week.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center text-gray-700">
                                <Play className="w-4 h-4 mr-2 text-purple-600" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Giảng viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>NL</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.instructor}</h3>
                        <p className="text-gray-600 mb-4">{course.instructorBio}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Kinh nghiệm:</span>
                            <p className="font-medium">8 năm</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Chứng chỉ:</span>
                            <p className="font-medium">RYT-500</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Học viên:</span>
                            <p className="font-medium">5,000+</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Đánh giá:</span>
                            <p className="font-medium">4.9/5</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá từ học viên</CardTitle>
                    <CardDescription>
                      {course.rating}/5 • {course.reviews} đánh giá
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold text-gray-900">{course.rating}</div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <Progress value={98} className="h-2" />
                          <p className="text-sm text-gray-600 mt-1">98% học viên đánh giá 5 sao</p>
                        </div>
                      </div>
                      
                      {/* Sample reviews */}
                      <div className="space-y-4">
                        {[
                          {
                            name: "Nguyễn Thị Mai",
                            rating: 5,
                            comment: "Khóa học rất chi tiết và dễ hiểu. Tôi từ một người không biết gì về yoga đã có thể thực hiện được nhiều tư thế cơ bản.",
                            date: "2 tuần trước"
                          },
                          {
                            name: "Trần Văn Nam",
                            rating: 5,
                            comment: "Giảng viên rất tận tâm, video chất lượng cao. Rất phù hợp cho người mới bắt đầu.",
                            date: "1 tháng trước"
                          }
                        ].map((review, index) => (
                          <div key={index} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{review.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-purple-600">{course.price}</span>
                    <span className="text-lg text-gray-500 line-through">{course.originalPrice}</span>
                  </div>
                  <Badge className="bg-red-100 text-red-700">Giảm 23%</Badge>
                </div>
                
                <div className="space-y-4 mb-6">
                  <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg">
                    Đăng ký ngay
                  </Button>
                  <Button variant="outline" className="w-full h-12">
                    Thêm vào giỏ hàng
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-600 mb-4">
                  💰 Hoàn tiền 100% trong 30 ngày
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số bài học:</span>
                    <span className="font-medium">{course.lessons} videos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Thời lượng:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trình độ:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngôn ngữ:</span>
                    <span className="font-medium flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {course.language}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chứng chỉ:</span>
                    <span className="font-medium flex items-center">
                      <Award className="w-4 h-4 mr-1 text-green-600" />
                      Có
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Truy cập:</span>
                    <span className="font-medium">Suốt đời</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Khóa học liên quan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Hatha Yoga Nâng Cao",
                    price: "1,499,000₫",
                    rating: 4.8,
                    students: "1,820"
                  },
                  {
                    title: "Vinyasa Flow",
                    price: "1,299,000₫",
                    rating: 4.9,
                    students: "3,150"
                  }
                ].map((relatedCourse, index) => (
                  <Link 
                    key={index} 
                    to={`/course/${index + 2}`}
                    className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{relatedCourse.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-purple-600">{relatedCourse.price}</span>
                      <div className="flex items-center text-gray-600">
                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                        {relatedCourse.rating}
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
