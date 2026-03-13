"use client";

import { useRouter } from "next/navigation";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
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
  const [input, setInput] = useState("");

  function handleSuggestionClick(
    appId: string,
    appName: string,
    appIcon: string,
    promptId: string,
    promptText: string
  ) {
    const sessionId = createSession(appId, appName, appIcon);
    addMessage(sessionId, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: promptText,
    });
    router.push(`/chat/${sessionId}?promptId=${promptId}`);
  }

  function handleSend() {
    if (!input.trim()) return;
    // Start a generic chat with the first app as default
    const defaultApp = miniApps[0];
    const sessionId = createSession(defaultApp.id, defaultApp.name, defaultApp.icon);
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-5">
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

        {/* Input */}
        <div className="w-full">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhắn tin cho Trợ lý V-AI..."
              rows={1}
              className="flex-1 bg-transparent resize-none text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none min-h-[24px] max-h-[120px]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-30 disabled:hover:bg-gray-900 transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Phản hồi AI là bản demo kịch bản. Chuyển sang API thật trong cài đặt.
          </p>
        </div>
      </div>
    </div>
  );
}
