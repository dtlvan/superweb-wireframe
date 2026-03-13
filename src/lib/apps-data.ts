import { MiniApp } from "./types";

export const miniApps: MiniApp[] = [
  {
    id: "vinpearl-travel",
    name: "VinPearl Travel",
    icon: "🏖️",
    category: "Du lịch",
    description: "Lên kế hoạch du lịch Việt Nam hoàn hảo với AI",
    longDescription:
      "VinPearl Travel là trợ lý du lịch AI giúp bạn khám phá Việt Nam. Nhận lịch trình cá nhân hóa, tìm resort tốt nhất, khám phá những điểm đến ẩn, và đặt hoạt động — tất cả qua cuộc trò chuyện tự nhiên. AI kết nối với hệ thống đặt phòng, dữ liệu thời tiết, và gợi ý địa phương để tạo chuyến đi hoàn hảo cho bạn.",
    screenshots: [],
    rating: 4.8,
    reviews: 2340,
    developer: "VinGroup",
    color: "#0EA5E9",
    prompts: [
      {
        id: "vp-1",
        text: "Lên lịch du lịch tại Nha Trang 3 ngày 2 đêm lễ 30/4",
        icon: "🗓️",
      },
      {
        id: "vp-2",
        text: "Tìm resort phù hợp gia đình ở Phú Quốc cho mùa hè",
        icon: "🏨",
      },
      {
        id: "vp-3",
        text: "Hoạt động hay nhất ở Đà Nẵng cuối tuần này là gì?",
        icon: "🎯",
      },
    ],
  },
  {
    id: "music-dj",
    name: "Music DJ",
    icon: "🎵",
    category: "Âm nhạc",
    description: "Khám phá và tạo playlist với AI thông minh",
    longDescription:
      "Music DJ sử dụng AI để hiểu tâm trạng, sở thích và bối cảnh của bạn để tạo playlist hoàn hảo. Dù bạn cần nhạc tập trung làm việc, nhạc tiệc tùng, hay nhạc chill cho chuyến road trip — chỉ cần mô tả và nhận ngay playlist được chọn lọc kèm điều khiển phát nhạc.",
    screenshots: [],
    rating: 4.6,
    reviews: 5120,
    developer: "SoundWave AI",
    color: "#8B5CF6",
    prompts: [
      {
        id: "mu-1",
        text: "Tạo playlist lo-fi chill cho đêm code khuya",
        icon: "🎧",
      },
      {
        id: "mu-2",
        text: "Tạo playlist nhạc V-pop hay nhất cho chuyến road trip",
        icon: "🚗",
      },
      {
        id: "mu-3",
        text: "K-pop đang trending tuần này là gì?",
        icon: "🔥",
      },
    ],
  },
  {
    id: "foodie-finder",
    name: "Foodie Finder",
    icon: "🍜",
    category: "Ẩm thực",
    description: "Khám phá nhà hàng, công thức nấu ăn và trải nghiệm ẩm thực",
    longDescription:
      "Foodie Finder là trợ lý ẩm thực cá nhân của bạn. Tìm nhà hàng ngon nhất gần bạn, nhận gợi ý phù hợp khẩu vị, khám phá địa điểm ăn uống trending, và cả công thức nấu ăn chi tiết — tất cả được hỗ trợ bởi AI am hiểu ẩm thực địa phương.",
    screenshots: [],
    rating: 4.7,
    reviews: 3890,
    developer: "TasteAI Labs",
    color: "#F97316",
    prompts: [
      {
        id: "fo-1",
        text: "Tìm quán phở ngon nhất Quận 1, TP. Hồ Chí Minh",
        icon: "🍲",
      },
      {
        id: "fo-2",
        text: "Gợi ý nhà hàng lãng mạn ở phố cổ Hà Nội",
        icon: "🕯️",
      },
      {
        id: "fo-3",
        text: "Cho tôi công thức làm bánh mì thịt heo quay giòn",
        icon: "👨‍🍳",
      },
    ],
  },
  {
    id: "shop-smart",
    name: "ShopSmart",
    icon: "🛍️",
    category: "Mua sắm",
    description: "So sánh giá, tìm deal tốt và gợi ý sản phẩm",
    longDescription:
      "ShopSmart là trợ lý mua sắm AI giúp bạn tìm sản phẩm tốt nhất với giá tốt nhất. So sánh giá trên nhiều nền tảng, nhận gợi ý cá nhân hóa, theo dõi giảm giá, và khám phá flash sale — tất cả qua cuộc trò chuyện đơn giản.",
    screenshots: [],
    rating: 4.5,
    reviews: 1890,
    developer: "DealHunter Inc",
    color: "#EC4899",
    prompts: [
      {
        id: "sh-1",
        text: "So sánh iPhone mới nhất với Samsung Galaxy giúp tôi",
        icon: "📱",
      },
      {
        id: "sh-2",
        text: "Tìm bàn phím cơ tốt nhất dưới 2 triệu đồng",
        icon: "⌨️",
      },
      {
        id: "sh-3",
        text: "Sản phẩm skincare tốt nhất cho da dầu là gì?",
        icon: "✨",
      },
    ],
  },
  {
    id: "fitness-coach",
    name: "FitCoach AI",
    icon: "💪",
    category: "Sức khỏe",
    description: "Huấn luyện viên AI cá nhân với kế hoạch tập luyện và dinh dưỡng",
    longDescription:
      "FitCoach AI là bạn đồng hành thể dục cá nhân. Nhận bài tập tùy chỉnh, theo dõi dinh dưỡng, đặt mục tiêu, và nhận hướng dẫn theo thời gian thực — dù bạn là người mới hay vận động viên. AI tự điều chỉnh theo trình độ, thiết bị có sẵn và lịch trình của bạn.",
    screenshots: [],
    rating: 4.9,
    reviews: 4560,
    developer: "FitTech AI",
    color: "#10B981",
    prompts: [
      {
        id: "fi-1",
        text: "Lên kế hoạch tập luyện 4 tuần tại nhà cho người mới",
        icon: "🏋️",
      },
      {
        id: "fi-2",
        text: "Nên ăn gì trước và sau khi chạy bộ buổi sáng?",
        icon: "🥗",
      },
      {
        id: "fi-3",
        text: "Thiết kế bài tập HIIT 30 phút không cần dụng cụ",
        icon: "⏱️",
      },
    ],
  },
  {
    id: "language-tutor",
    name: "LinguaAI",
    icon: "🗣️",
    category: "Giáo dục",
    description: "Học ngoại ngữ qua hội thoại AI tương tác",
    longDescription:
      "LinguaAI là trải nghiệm học ngôn ngữ nhập vai. Luyện hội thoại 50+ ngôn ngữ với AI tự điều chỉnh theo trình độ. Nhận sửa ngữ pháp, giải thích từ vựng, mẹo phát âm, và ngữ cảnh văn hóa — tất cả trong cuộc đối thoại tự nhiên.",
    screenshots: [],
    rating: 4.7,
    reviews: 6780,
    developer: "PolyglotAI",
    color: "#6366F1",
    prompts: [
      {
        id: "la-1",
        text: "Dạy tôi các câu chào hỏi cơ bản tiếng Việt",
        icon: "🇻🇳",
      },
      {
        id: "la-2",
        text: "Luyện gọi món ăn bằng tiếng Nhật tại nhà hàng",
        icon: "🇯🇵",
      },
      {
        id: "la-3",
        text: "Giúp tôi ôn thi IELTS phần Speaking",
        icon: "📝",
      },
    ],
  },
  {
    id: "movie-night",
    name: "MovieNight",
    icon: "🎬",
    category: "Giải trí",
    description: "Gợi ý phim & show cá nhân hóa kèm trailer",
    longDescription:
      "MovieNight là trợ lý giải trí AI. Mô tả tâm trạng, thể loại yêu thích, và nhận gợi ý phim được chọn lọc kèm trailer, đánh giá, và nơi xem. Không còn phải lướt Netflix 30 phút nữa.",
    screenshots: [],
    rating: 4.4,
    reviews: 2100,
    developer: "StreamGuide AI",
    color: "#EF4444",
    prompts: [
      {
        id: "mo-1",
        text: "Gợi ý phim kinh dị cho buổi hẹn hò",
        icon: "🎥",
      },
      {
        id: "mo-2",
        text: "Phim Việt Nam hay nhất năm 2024 là gì?",
        icon: "🇻🇳",
      },
      {
        id: "mo-3",
        text: "Tìm anime tương tự Attack on Titan",
        icon: "⚔️",
      },
    ],
  },
  {
    id: "weather-planner",
    name: "WeatherWise",
    icon: "🌤️",
    category: "Tiện ích",
    description: "Dự báo thời tiết thông minh kèm gợi ý hoạt động",
    longDescription:
      "WeatherWise không chỉ dự báo thời tiết đơn thuần. Nhận gợi ý hoạt động dựa trên thời tiết, tư vấn trang phục, so sánh thời tiết du lịch, và cảnh báo thời tiết khắc nghiệt — tất cả được cá nhân hóa theo vị trí và sở thích của bạn.",
    screenshots: [],
    rating: 4.3,
    reviews: 1560,
    developer: "ClimaAI",
    color: "#0891B2",
    prompts: [
      {
        id: "we-1",
        text: "Thời tiết Đà Lạt cuối tuần này thế nào?",
        icon: "☁️",
      },
      {
        id: "we-2",
        text: "Thời điểm tốt nhất để đi Sapa trekking?",
        icon: "🏔️",
      },
      {
        id: "we-3",
        text: "So sánh thời tiết Nha Trang và Phú Quốc tuần tới",
        icon: "⛅",
      },
    ],
  },
];

export const categories = [
  "Tất cả",
  ...Array.from(new Set(miniApps.map((app) => app.category))),
];

export function getAppById(id: string): MiniApp | undefined {
  return miniApps.find((app) => app.id === id);
}
