"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  MapPin,
  Briefcase,
  PartyPopper,
  Sparkles,
  Check,
  ArrowUpRight,
  MessageCircle,
  Zap,
  Globe,
} from "lucide-react";

const useCases = [
  {
    icon: <MapPin size={20} />,
    title: "Lên lịch du lịch nhóm",
    desc: "Cả nhóm cùng hỏi AI về địa điểm, lịch trình, chi phí — AI tổng hợp và đề xuất plan hoàn hảo.",
  },
  {
    icon: <PartyPopper size={20} />,
    title: "Chốt địa điểm team building",
    desc: "AI gợi ý phù hợp với budget, số người — mọi người vote trực tiếp trong chat.",
  },
  {
    icon: <Briefcase size={20} />,
    title: "Trợ lý công việc nhóm",
    desc: "Phân chia task, tóm tắt meeting, theo dõi tiến độ — AI hỗ trợ cả team hiệu quả hơn.",
  },
];

const features = [
  { icon: <MessageCircle size={16} />, text: "Nhiều người chat cùng 1 AI real-time" },
  { icon: <Zap size={16} />, text: "AI hiểu ngữ cảnh nhóm, gợi ý phù hợp" },
  { icon: <Globe size={16} />, text: "Kết nối Mini App — bản đồ, đặt vé, so giá" },
  { icon: <Sparkles size={16} />, text: "Tự động tổng hợp ý kiến, đề xuất tối ưu" },
];

export default function GroupChatPage() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      {/* ── Hero: full viewport ── */}
      <div className="min-h-full flex flex-col px-10 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold uppercase tracking-wide">
            Sắp ra mắt
          </span>
        </div>

        {/* Headline — big & bold, vertically centered */}
        <div className="my-auto py-8">
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-gray-900 leading-[1.05] tracking-tight max-w-[680px]">
            Chat nhóm
            <br />
            với trợ lý AI
          </h1>
          <p className="mt-5 text-gray-500 text-[16px] leading-relaxed max-w-[480px]">
            Mời bạn bè, đồng nghiệp vào cùng một cuộc trò chuyện với AI.
            Lên kế hoạch, brainstorm, ra quyết định — tất cả trong thời gian thực.
          </p>
        </div>

        {/* Bottom bar: CTA left, meta right */}
        <div className="flex items-end justify-between mt-auto">
          {joined ? (
            <div className="flex items-center gap-3 bg-gray-100 rounded-full pl-5 pr-6 py-3">
              <Check size={18} className="text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                Đã tham gia danh sách chờ!
              </span>
            </div>
          ) : (
            <button
              onClick={() => setJoined(true)}
              className="group flex items-center gap-0 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors active:scale-[0.97]"
            >
              <span className="pl-5 pr-3 py-3 text-sm font-medium">
                Tham gia danh sách chờ
              </span>
              <span className="w-9 h-9 rounded-full bg-[#c8ff00] flex items-center justify-center mr-1.5">
                <ArrowUpRight size={16} className="text-gray-900" />
              </span>
            </button>
          )}

          <div className="flex items-center gap-2.5 text-gray-400">
            <Users size={16} />
            <span className="text-xs">
              Nhiều người · Một AI · Thời gian thực
            </span>
          </div>
        </div>
      </div>

      {/* ── Below fold: details ── */}
      <div className="px-10 pb-12">
        {/* Divider */}
        <div className="h-px bg-gray-200 mb-12" />

        {/* Use cases */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold text-gray-400 mb-5 uppercase tracking-widest">
            Bạn có thể dùng cho
          </h2>
          <div className="grid gap-4 max-w-2xl">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-600">
                  {uc.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">
                    {uc.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold text-gray-400 mb-5 uppercase tracking-widest">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            {features.map((f) => (
              <div
                key={f.text}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gray-50"
              >
                <div className="text-gray-400 mt-0.5 shrink-0">{f.icon}</div>
                <span className="text-[13px] text-gray-600 leading-snug">
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat preview */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 mb-5 uppercase tracking-widest">
            Hình dung trải nghiệm
          </h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white max-w-2xl">
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                <Users size={12} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-900">
                  Du lịch Đà Lạt — Team Design
                </p>
                <p className="text-[10px] text-gray-400">
                  4 thành viên · AI đang hoạt động
                </p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                  M
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2 max-w-[80%]">
                  <p className="text-[13px] text-gray-700">
                    Mọi người muốn đi Đà Lạt cuối tháng không? AI ơi gợi ý lịch trình 3N2Đ cho 4 người!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-pink-600 shrink-0">
                  H
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2 max-w-[80%]">
                  <p className="text-[13px] text-gray-700">
                    Vote! Mình thích chỗ nào có view đẹp nha
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-md px-3.5 py-2 max-w-[85%]">
                  <p className="text-[13px] text-gray-700">
                    Dựa trên sở thích cả nhóm, mình đề xuất: <strong>Ngày 1</strong> — homestay view đồi, <strong>Ngày 2</strong> — vườn hoa + cà phê, <strong>Ngày 3</strong> — chợ Đà Lạt. Budget ~<strong>2.5tr/người</strong>. Tạo bản đồ chi tiết nhé?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
