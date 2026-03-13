"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Download, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getAppById } from "@/lib/apps-data";
import {
  createSession,
  addMessage,
} from "@/lib/chat-store";

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const app = getAppById(params.id as string);

  if (!app) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Không tìm thấy ứng dụng</p>
      </div>
    );
  }

  function handlePromptClick(promptId: string, promptText: string) {
    if (!app) return;
    const sessionId = createSession(app.id, app.name, app.icon, promptText, promptId);
    addMessage(sessionId, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: promptText,
    });
    router.push(`/chat/${sessionId}`);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back button */}
        <Link
          href="/apps"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại Ứng dụng
        </Link>

        {/* Hero */}
        <div className="flex items-start gap-5 mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shrink-0"
            style={{ backgroundColor: app.color + "20" }}
          >
            {app.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{app.name}</h1>
            <p className="text-sm text-gray-500 mb-3">
              {app.developer} · {app.category}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-900">
                  {app.rating}
                </span>
                <span className="text-sm text-gray-400">
                  ({app.reviews.toLocaleString()} đánh giá)
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</h2>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            {app.longDescription}
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Ứng dụng này có thể làm gì
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Hội thoại hỗ trợ bởi AI",
              "Widget tương tác",
              "Dữ liệu thời gian thực",
              "Kết quả cá nhân hóa",
            ].map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Starters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thử hỏi...
          </h2>
          <div className="space-y-3">
            {app.prompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt.id, prompt.text)}
                className="w-full text-left p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{prompt.icon}</span>
                  <span className="text-[15px] text-gray-700 group-hover:text-gray-900 transition-colors">
                    {prompt.text}
                  </span>
                  <ArrowLeft
                    size={16}
                    className="ml-auto text-gray-300 group-hover:text-gray-500 rotate-180 transition-all group-hover:translate-x-1"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-3 gap-4 text-center pb-8">
          {[
            { label: "Danh mục", value: app.category },
            { label: "Nhà phát triển", value: app.developer },
            { label: "Đánh giá", value: `${app.rating} / 5.0` },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
