"use client";

import { useRouter } from "next/navigation";
import { Send, Sparkles, Paperclip, Mic, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { miniApps } from "@/lib/apps-data";
import { createSession, addMessage } from "@/lib/chat-store";

// Pick a diverse set of suggestion prompts from different apps
const suggestions = [
  { app: miniApps[0], prompt: miniApps[0].prompts[0] }, // Travel
  { app: miniApps[1], prompt: miniApps[1].prompts[0] }, // Music
  { app: miniApps[2], prompt: miniApps[2].prompts[0] }, // Food
  { app: miniApps[3], prompt: miniApps[3].prompts[0] }, // Shopping
  { app: miniApps[4], prompt: miniApps[4].prompts[0] }, // Fitness
  { app: miniApps[5], prompt: miniApps[5].prompts[0] }, // Language
];

export default function Home() {
  const router = useRouter();

  // Prefetch chat route so navigation is instant
  useEffect(() => {
    router.prefetch("/chat/placeholder");
  }, [router]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  function handleSuggestionClick(
    appId: string,
    appName: string,
    appIcon: string,
    promptId: string,
    promptText: string
  ) {
    const sessionId = createSession(appId, appName, appIcon, promptText, promptId);
    addMessage(sessionId, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: promptText,
    });
    router.push(`/chat/${sessionId}`);
  }

  function handleSend() {
    if (!input.trim()) return;
    // Start a generic chat with the first app as default
    const defaultApp = miniApps[0];
    const sessionId = createSession(defaultApp.id, defaultApp.name, defaultApp.icon, input.trim());
    addMessage(sessionId, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: input.trim(),
    });
    router.push(`/chat/${sessionId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* Branding */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EA0029] mb-5">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Trợ lý V-AI
          </h1>
          <p className="text-gray-500 text-[15px]">
            Trò chuyện với các AI chuyên biệt qua V-App Superweb
          </p>
        </div>

        {/* Suggestions */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-6">
          {suggestions.map(({ app, prompt }) => (
            <button
              key={prompt.id}
              onClick={() =>
                handleSuggestionClick(
                  app.id,
                  app.name,
                  app.icon,
                  prompt.id,
                  prompt.text
                )
              }
              className="text-left p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0 mt-0.5">{prompt.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700 group-hover:text-gray-900 line-clamp-2 leading-snug">
                    {prompt.text}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{app.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* AI Prompt Input */}
        <div className="w-full">
          <div className={`relative rounded-2xl border transition-all duration-200 ${
            input.trim()
              ? "border-violet-300 ring-2 ring-violet-100 bg-white shadow-sm"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}>
            {/* Input area */}
            <div className="flex items-end gap-2 px-4 pt-3 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Hỏi Trợ lý V-AI bất cứ điều gì..."
                rows={1}
                className="flex-1 bg-transparent resize-none text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none min-h-[24px] max-h-[120px]"
              />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Đính kèm file"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Nhập giọng nói"
                >
                  <Mic size={16} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Tìm trên web"
                >
                  <Globe size={16} />
                </button>
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  input.trim()
                    ? "bg-[#EA0029] hover:bg-[#C80023] text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Sparkles size={12} />
                Gửi
                <Send size={12} />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-1.5">
            AI Agent sẽ phân tích và trả lời dựa trên ngữ cảnh cuộc trò chuyện
          </p>
        </div>
      </div>
    </div>
  );
}
