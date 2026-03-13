"use client";

import { useEffect, useState, useCallback } from "react";
import { Brain, Search, Database, Zap, Sparkles, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";

interface ThoughtStep {
  icon: LucideIcon;
  text: string;
  detail?: string;
}

/* Per-app chain of thought steps */
const APP_THOUGHTS: Record<string, ThoughtStep[]> = {
  "vinpearl-travel": [
    { icon: Brain, text: "Phân tích yêu cầu du lịch", detail: "Xác định địa điểm, thời gian, ngân sách" },
    { icon: Search, text: "Tìm kiếm thông tin điểm đến", detail: "Kết nối API du lịch và đánh giá" },
    { icon: Database, text: "Truy vấn dữ liệu khách sạn & vé", detail: "So sánh giá từ nhiều nguồn" },
    { icon: Zap, text: "Tạo lịch trình tối ưu", detail: "Sắp xếp theo khoảng cách và thời gian" },
    { icon: Sparkles, text: "Tổng hợp gợi ý cá nhân hóa" },
  ],
  "music-dj": [
    { icon: Brain, text: "Phân tích tâm trạng & bối cảnh", detail: "Xác định mood, tempo, thể loại" },
    { icon: Search, text: "Tìm kiếm bài hát phù hợp", detail: "Quét thư viện nhạc 50M+ bài" },
    { icon: Database, text: "Phân tích BPM & đặc tính âm thanh", detail: "Đối chiếu với yêu cầu người dùng" },
    { icon: Zap, text: "Sắp xếp thứ tự phát", detail: "Tối ưu flow & chuyển tiếp mượt mà" },
    { icon: Sparkles, text: "Hoàn thiện playlist" },
  ],
  "foodie-finder": [
    { icon: Brain, text: "Hiểu sở thích ẩm thực", detail: "Phân tích khẩu vị & chế độ ăn" },
    { icon: Search, text: "Tìm kiếm nhà hàng & quán ăn", detail: "Quét 15,000+ địa điểm gần bạn" },
    { icon: Database, text: "Đọc đánh giá & xếp hạng", detail: "Tổng hợp từ Google, Foody, TripAdvisor" },
    { icon: Zap, text: "Lọc & xếp hạng kết quả", detail: "Ưu tiên chất lượng & khoảng cách" },
    { icon: Sparkles, text: "Chuẩn bị gợi ý cho bạn" },
  ],
  "shop-smart": [
    { icon: Brain, text: "Phân tích yêu cầu sản phẩm", detail: "Xác định ngân sách & tính năng cần" },
    { icon: Search, text: "Quét giá trên các sàn TMĐT", detail: "Shopee, Lazada, Tiki, Amazon..." },
    { icon: Database, text: "Thu thập đánh giá người dùng", detail: "Phân tích 10,000+ reviews" },
    { icon: Zap, text: "So sánh & xếp hạng", detail: "Cân nhắc giá, chất lượng, bảo hành" },
    { icon: Sparkles, text: "Tổng hợp gợi ý tốt nhất" },
  ],
  "fitness-coach": [
    { icon: Brain, text: "Đánh giá thể trạng & mục tiêu", detail: "Xem xét trình độ và thiết bị có sẵn" },
    { icon: Search, text: "Tra cứu bài tập phù hợp", detail: "Từ thư viện 500+ bài tập" },
    { icon: Database, text: "Tính toán cường độ & thời lượng", detail: "Dựa trên khoa học thể thao" },
    { icon: Zap, text: "Thiết kế chương trình tập", detail: "Phân bổ nhóm cơ & thời gian nghỉ" },
    { icon: Sparkles, text: "Hoàn thiện kế hoạch cho bạn" },
  ],
  "language-tutor": [
    { icon: Brain, text: "Đánh giá trình độ ngôn ngữ", detail: "Xác định level & mục tiêu học" },
    { icon: Search, text: "Tìm nội dung phù hợp", detail: "Chọn từ vựng & ngữ pháp cần thiết" },
    { icon: Database, text: "Chuẩn bị bài giảng", detail: "Kèm ví dụ thực tế & ngữ cảnh" },
    { icon: Zap, text: "Tạo bài tập tương tác", detail: "Thiết kế câu hỏi & tình huống" },
    { icon: Sparkles, text: "Sẵn sàng dạy bạn" },
  ],
  "movie-night": [
    { icon: Brain, text: "Phân tích tâm trạng & sở thích", detail: "Thể loại, đạo diễn, diễn viên yêu thích" },
    { icon: Search, text: "Tìm kiếm trong thư viện phim", detail: "Quét 100,000+ phim & series" },
    { icon: Database, text: "Đọc đánh giá & xếp hạng", detail: "IMDb, Rotten Tomatoes, Letterboxd" },
    { icon: Zap, text: "Lọc theo nền tảng phát", detail: "Netflix, Disney+, Apple TV+..." },
    { icon: Sparkles, text: "Chuẩn bị danh sách cho bạn" },
  ],
  "weather-planner": [
    { icon: Brain, text: "Xác định vị trí & thời gian", detail: "Phân tích yêu cầu dự báo" },
    { icon: Search, text: "Thu thập dữ liệu khí tượng", detail: "Từ nhiều trạm quan trắc" },
    { icon: Database, text: "Phân tích mô hình thời tiết", detail: "So sánh 3 mô hình dự báo" },
    { icon: Zap, text: "Tạo gợi ý hoạt động", detail: "Dựa trên điều kiện thời tiết" },
    { icon: Sparkles, text: "Hoàn thiện dự báo cho bạn" },
  ],
};

const DEFAULT_THOUGHTS: ThoughtStep[] = [
  { icon: Brain, text: "Phân tích yêu cầu", detail: "Hiểu ngữ cảnh cuộc trò chuyện" },
  { icon: Search, text: "Tìm kiếm thông tin", detail: "Kết nối các nguồn dữ liệu" },
  { icon: Database, text: "Xử lý dữ liệu", detail: "Tổng hợp và phân tích" },
  { icon: Zap, text: "Tạo câu trả lời", detail: "Cá nhân hóa nội dung" },
  { icon: Sparkles, text: "Hoàn thiện phản hồi" },
];

export function AIChainOfThought({
  appId,
  isActive,
}: {
  appId: string;
  isActive: boolean;
}) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const thoughts = APP_THOUGHTS[appId] || DEFAULT_THOUGHTS;

  // Reveal steps one by one while thinking
  useEffect(() => {
    if (!isActive) {
      // When thinking finishes, collapse but keep visible
      if (hasShown) {
        setIsOpen(false);
      }
      return;
    }

    // Start thinking: expand and reveal steps
    setHasShown(true);
    setIsOpen(true);
    setVisibleSteps(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= thoughts.length) {
        setVisibleSteps(step);
      }
      if (step >= thoughts.length) {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isActive, thoughts.length, hasShown]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Don't render until first thinking phase starts
  if (!hasShown && !isActive) return null;

  return (
    <div className="mb-4 animate-fade-in">
      <div className="flex gap-3">
        {/* AI Avatar */}
        <div className="relative shrink-0 mt-0.5">
          <div className={`w-8 h-8 rounded-full bg-[#EA0029] flex items-center justify-center shadow-sm ${
            isActive ? "animate-[ai-pulse_2s_ease-in-out_infinite]" : ""
          }`}>
            <Sparkles size={14} className="text-white" />
          </div>
          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#EA0029]/70 border-2 border-white rounded-full animate-pulse" />
          )}
        </div>

        {/* Chain of thought using AI Elements */}
        <div className="flex-1 min-w-0">
          <ChainOfThought open={isOpen} onOpenChange={handleOpenChange}>
            <ChainOfThoughtHeader className="text-gray-600 hover:text-gray-900">
              <span className="flex items-center gap-2">
                {isActive ? "AI Agent đang suy nghĩ" : "AI Agent đã hoàn thành suy nghĩ"}
                {isActive && (
                  <Loader2 size={12} className="text-gray-400 animate-spin" />
                )}
                {!isActive && (
                  <span className="text-[10px] text-gray-400 font-normal">
                    {thoughts.length} bước
                  </span>
                )}
              </span>
            </ChainOfThoughtHeader>

            <ChainOfThoughtContent>
              {thoughts.slice(0, isActive ? visibleSteps : thoughts.length).map((step, i) => {
                const isCurrentStep = isActive && i === visibleSteps - 1;
                const isCompleted = !isActive || i < visibleSteps - 1;

                return (
                  <ChainOfThoughtStep
                    key={i}
                    icon={step.icon}
                    label={step.text}
                    description={step.detail}
                    status={
                      isCompleted
                        ? "complete"
                        : isCurrentStep
                        ? "active"
                        : "pending"
                    }
                  />
                );
              })}
            </ChainOfThoughtContent>
          </ChainOfThought>
        </div>
      </div>
    </div>
  );
}
