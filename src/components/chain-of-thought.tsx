"use client";

import { useEffect, useState } from "react";
import { Brain, Search, Database, Zap, CheckCircle2, Sparkles, Loader2 } from "lucide-react";

interface ThoughtStep {
  icon: "brain" | "search" | "database" | "zap" | "sparkles";
  text: string;
  detail?: string;
}

const ICON_MAP = {
  brain: Brain,
  search: Search,
  database: Database,
  zap: Zap,
  sparkles: Sparkles,
};

/* Per-app chain of thought steps */
const APP_THOUGHTS: Record<string, ThoughtStep[]> = {
  "vinpearl-travel": [
    { icon: "brain", text: "Phân tích yêu cầu du lịch", detail: "Xác định địa điểm, thời gian, ngân sách" },
    { icon: "search", text: "Tìm kiếm thông tin điểm đến", detail: "Kết nối API du lịch và đánh giá" },
    { icon: "database", text: "Truy vấn dữ liệu khách sạn & vé", detail: "So sánh giá từ nhiều nguồn" },
    { icon: "zap", text: "Tạo lịch trình tối ưu", detail: "Sắp xếp theo khoảng cách và thời gian" },
    { icon: "sparkles", text: "Tổng hợp gợi ý cá nhân hóa" },
  ],
  "music-dj": [
    { icon: "brain", text: "Phân tích tâm trạng & bối cảnh", detail: "Xác định mood, tempo, thể loại" },
    { icon: "search", text: "Tìm kiếm bài hát phù hợp", detail: "Quét thư viện nhạc 50M+ bài" },
    { icon: "database", text: "Phân tích BPM & đặc tính âm thanh", detail: "Đối chiếu với yêu cầu người dùng" },
    { icon: "zap", text: "Sắp xếp thứ tự phát", detail: "Tối ưu flow & chuyển tiếp mượt mà" },
    { icon: "sparkles", text: "Hoàn thiện playlist" },
  ],
  "foodie-finder": [
    { icon: "brain", text: "Hiểu sở thích ẩm thực", detail: "Phân tích khẩu vị & chế độ ăn" },
    { icon: "search", text: "Tìm kiếm nhà hàng & quán ăn", detail: "Quét 15,000+ địa điểm gần bạn" },
    { icon: "database", text: "Đọc đánh giá & xếp hạng", detail: "Tổng hợp từ Google, Foody, TripAdvisor" },
    { icon: "zap", text: "Lọc & xếp hạng kết quả", detail: "Ưu tiên chất lượng & khoảng cách" },
    { icon: "sparkles", text: "Chuẩn bị gợi ý cho bạn" },
  ],
  "shop-smart": [
    { icon: "brain", text: "Phân tích yêu cầu sản phẩm", detail: "Xác định ngân sách & tính năng cần" },
    { icon: "search", text: "Quét giá trên các sàn TMĐT", detail: "Shopee, Lazada, Tiki, Amazon..." },
    { icon: "database", text: "Thu thập đánh giá người dùng", detail: "Phân tích 10,000+ reviews" },
    { icon: "zap", text: "So sánh & xếp hạng", detail: "Cân nhắc giá, chất lượng, bảo hành" },
    { icon: "sparkles", text: "Tổng hợp gợi ý tốt nhất" },
  ],
  "fitness-coach": [
    { icon: "brain", text: "Đánh giá thể trạng & mục tiêu", detail: "Xem xét trình độ và thiết bị có sẵn" },
    { icon: "search", text: "Tra cứu bài tập phù hợp", detail: "Từ thư viện 500+ bài tập" },
    { icon: "database", text: "Tính toán cường độ & thời lượng", detail: "Dựa trên khoa học thể thao" },
    { icon: "zap", text: "Thiết kế chương trình tập", detail: "Phân bổ nhóm cơ & thời gian nghỉ" },
    { icon: "sparkles", text: "Hoàn thiện kế hoạch cho bạn" },
  ],
  "language-tutor": [
    { icon: "brain", text: "Đánh giá trình độ ngôn ngữ", detail: "Xác định level & mục tiêu học" },
    { icon: "search", text: "Tìm nội dung phù hợp", detail: "Chọn từ vựng & ngữ pháp cần thiết" },
    { icon: "database", text: "Chuẩn bị bài giảng", detail: "Kèm ví dụ thực tế & ngữ cảnh" },
    { icon: "zap", text: "Tạo bài tập tương tác", detail: "Thiết kế câu hỏi & tình huống" },
    { icon: "sparkles", text: "Sẵn sàng dạy bạn" },
  ],
  "movie-night": [
    { icon: "brain", text: "Phân tích tâm trạng & sở thích", detail: "Thể loại, đạo diễn, diễn viên yêu thích" },
    { icon: "search", text: "Tìm kiếm trong thư viện phim", detail: "Quét 100,000+ phim & series" },
    { icon: "database", text: "Đọc đánh giá & xếp hạng", detail: "IMDb, Rotten Tomatoes, Letterboxd" },
    { icon: "zap", text: "Lọc theo nền tảng phát", detail: "Netflix, Disney+, Apple TV+..." },
    { icon: "sparkles", text: "Chuẩn bị danh sách cho bạn" },
  ],
  "weather-planner": [
    { icon: "brain", text: "Xác định vị trí & thời gian", detail: "Phân tích yêu cầu dự báo" },
    { icon: "search", text: "Thu thập dữ liệu khí tượng", detail: "Từ nhiều trạm quan trắc" },
    { icon: "database", text: "Phân tích mô hình thời tiết", detail: "So sánh 3 mô hình dự báo" },
    { icon: "zap", text: "Tạo gợi ý hoạt động", detail: "Dựa trên điều kiện thời tiết" },
    { icon: "sparkles", text: "Hoàn thiện dự báo cho bạn" },
  ],
};

const DEFAULT_THOUGHTS: ThoughtStep[] = [
  { icon: "brain", text: "Phân tích yêu cầu", detail: "Hiểu ngữ cảnh cuộc trò chuyện" },
  { icon: "search", text: "Tìm kiếm thông tin", detail: "Kết nối các nguồn dữ liệu" },
  { icon: "database", text: "Xử lý dữ liệu", detail: "Tổng hợp và phân tích" },
  { icon: "zap", text: "Tạo câu trả lời", detail: "Cá nhân hóa nội dung" },
  { icon: "sparkles", text: "Hoàn thiện phản hồi" },
];

export function ChainOfThought({
  appId,
  isActive,
}: {
  appId: string;
  isActive: boolean;
}) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const thoughts = APP_THOUGHTS[appId] || DEFAULT_THOUGHTS;

  useEffect(() => {
    if (!isActive) {
      setVisibleSteps(0);
      setActiveStep(0);
      return;
    }

    // Reveal steps one by one
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= thoughts.length) {
        setVisibleSteps(step);
        setActiveStep(step - 1);
      } else {
        // Cycle the "active" indicator on the last step
        setActiveStep(thoughts.length - 1);
      }
      if (step > thoughts.length) {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isActive, thoughts.length]);

  if (!isActive || visibleSteps === 0) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex gap-3">
        {/* AI Avatar */}
        <div className="relative shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-sm animate-[ai-pulse_2s_ease-in-out_infinite]">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 border-2 border-white rounded-full animate-pulse" />
        </div>

        {/* Chain of thought steps */}
        <div className="flex-1 min-w-0">
          <div className="bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/30 rounded-2xl border border-violet-100/60 px-4 py-3 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-violet-100/50">
              <Brain size={14} className="text-violet-500" />
              <span className="text-xs font-semibold text-violet-700">AI Agent đang suy nghĩ</span>
              <Loader2 size={12} className="text-violet-400 animate-spin ml-auto" />
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              {thoughts.slice(0, visibleSteps).map((step, i) => {
                const IconComponent = ICON_MAP[step.icon];
                const isCurrentStep = i === activeStep && i === visibleSteps - 1;
                const isCompleted = i < visibleSteps - 1;

                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 py-1.5 px-2 rounded-lg transition-all duration-300 ${
                      isCurrentStep
                        ? "bg-white/70 shadow-sm border border-violet-100/50"
                        : ""
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Step icon */}
                    <div className={`mt-0.5 shrink-0 ${
                      isCompleted
                        ? "text-green-500"
                        : isCurrentStep
                        ? "text-violet-500"
                        : "text-gray-300"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={14} />
                      ) : isCurrentStep ? (
                        <div className="relative">
                          <IconComponent size={14} className="animate-pulse" />
                        </div>
                      ) : (
                        <IconComponent size={14} />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${
                        isCompleted
                          ? "text-gray-500"
                          : isCurrentStep
                          ? "text-violet-700"
                          : "text-gray-400"
                      }`}>
                        {step.text}
                      </span>
                      {step.detail && isCurrentStep && (
                        <p className="text-[10px] text-violet-400 mt-0.5 animate-fade-in">
                          {step.detail}
                        </p>
                      )}
                    </div>

                    {/* Status indicator */}
                    {isCurrentStep && (
                      <div className="flex gap-0.5 mt-1 shrink-0">
                        <span className="w-1 h-1 bg-violet-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
                        <span className="w-1 h-1 bg-violet-300 rounded-full animate-[bounce_1s_ease-in-out_0.15s_infinite]" />
                        <span className="w-1 h-1 bg-violet-200 rounded-full animate-[bounce_1s_ease-in-out_0.3s_infinite]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-3 pt-2 border-t border-violet-100/50">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-violet-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(visibleSteps / thoughts.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-violet-400 tabular-nums shrink-0">
                  {visibleSteps}/{thoughts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
