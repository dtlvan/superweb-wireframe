"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Send,
  Square,
  Sparkles,
  ArrowLeft,
  Paperclip,
  Mic,
  Globe,
  AlertTriangle,
  Lock,
} from "lucide-react";
import {
  getSession,
  getSessions,
  subscribe,
  addMessage,
  updateLastAssistantMessage,
} from "@/lib/chat-store";
import {
  subscribeAuth,
  getAuthState,
  recordGuestMessage,
} from "@/lib/auth-store";
import { getScriptedResponse } from "@/lib/scripted-conversations";
import { ChatMessageBubble } from "@/components/chat-message";
import { AIChainOfThought } from "@/components/chain-of-thought";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Widget } from "@/lib/types";
import { useRouter } from "next/navigation";

let msgCounter = 0;
function nextMsgId() {
  return `msg-${Date.now()}-${++msgCounter}`;
}

/* Suggested follow-up prompts shown after AI finishes */
const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  "vinpearl-travel": [
    "Tìm vé máy bay giá rẻ",
    "Gợi ý nhà hàng gần đó",
    "Thời tiết hôm nay thế nào?",
  ],
  "music-dj": [
    "Tạo thêm playlist khác",
    "Tìm bài tương tự",
    "Nhạc đang trending",
  ],
  "foodie-finder": [
    "Tìm quán gần đây hơn",
    "Xem thực đơn chi tiết",
    "Gợi ý món khác",
  ],
  "shop-smart": [
    "Tìm mã giảm giá",
    "So sánh thêm sản phẩm",
    "Đánh giá từ người dùng",
  ],
  "fitness-coach": [
    "Xem bài tập tiếp theo",
    "Gợi ý chế độ ăn",
    "Theo dõi tiến trình",
  ],
  "language-tutor": [
    "Luyện tập thêm",
    "Giải thích ngữ pháp",
    "Kiểm tra từ vựng",
  ],
  "movie-night": [
    "Xem trailer phim",
    "Tìm phim tương tự",
    "Phim đang chiếu rạp",
  ],
  "weather-planner": [
    "Dự báo tuần tới",
    "Gợi ý hoạt động",
    "So sánh thời tiết",
  ],
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.appId as string;

  const sessions = useSyncExternalStore(subscribe, getSessions, getSessions);
  const authState = useSyncExternalStore(subscribeAuth, getAuthState, getAuthState);
  const session = getSession(sessionId);

  // Derive limit state from reactive authState
  const isGuest = !authState.user;
  const remaining = isGuest ? Math.max(0, 5 - authState.messageCount) : Infinity; // TODO: change back to 20
  const showWarning = isGuest && remaining > 0 && remaining <= 3;
  const limitReached = isGuest && remaining <= 0;

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions]);

  // Auto-trigger scripted response for prompt starters
  useEffect(() => {
    if (!session?.promptId || startedRef.current) return;
    if (session.messages.length !== 1) return;
    startedRef.current = true;
    streamScriptedResponse(session.promptId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  async function simulateThinking(durationMs: number = 2800) {
    setIsThinking(true);
    // Wait for chain-of-thought animation to complete
    await delay(durationMs);
    if (abortRef.current) {
      setIsThinking(false);
      return;
    }
    setIsThinking(false);
  }

  async function streamScriptedResponse(pId: string) {
    const scripted = getScriptedResponse(pId);
    if (!scripted || !session) return;

    setIsStreaming(true);
    abortRef.current = false;

    // Add empty assistant message (shows thinking indicator)
    addMessage(sessionId, {
      id: nextMsgId(),
      role: "assistant",
      content: "",
      widgets: [],
      isStreaming: true,
    });

    // AI thinking phase — show chain-of-thought reasoning
    await simulateThinking(2800);
    if (abortRef.current) {
      setIsStreaming(false);
      return;
    }

    let fullContent = "";
    const allWidgets = [...scripted.widgets];
    let widgetIdx = 0;
    const usedWidgets: Widget[] = [];

    for (const chunk of scripted.chunks) {
      if (abortRef.current) break;

      // Check if chunk is a widget placeholder
      if (chunk.startsWith("<<WIDGET:")) {
        fullContent += chunk;
        if (widgetIdx < allWidgets.length) {
          usedWidgets.push(allWidgets[widgetIdx++]);
        }
        updateLastAssistantMessage(sessionId, fullContent, usedWidgets, true);
      } else {
        // Stream char by char for text chunks (but in small groups for speed)
        const chars = chunk.split("");
        let i = 0;
        while (i < chars.length) {
          if (abortRef.current) break;
          const batchSize = Math.min(3, chars.length - i);
          fullContent += chars.slice(i, i + batchSize).join("");
          i += batchSize;
          updateLastAssistantMessage(sessionId, fullContent, usedWidgets, true);
          await delay(15);
        }
      }
    }

    updateLastAssistantMessage(sessionId, fullContent, usedWidgets, false);
    setIsStreaming(false);
  }

  async function handleSend(text?: string) {
    const userMsg = (text || input).trim();
    if (!userMsg || isStreaming || !session || limitReached) return;

    // Record guest message usage
    if (!recordGuestMessage()) return;

    setInput("");

    addMessage(sessionId, {
      id: nextMsgId(),
      role: "user",
      content: userMsg,
    });

    // Generic mock response
    setIsStreaming(true);
    abortRef.current = false;

    addMessage(sessionId, {
      id: nextMsgId(),
      role: "assistant",
      content: "",
      isStreaming: true,
    });

    // AI thinking phase — show chain-of-thought reasoning
    await simulateThinking(2800);
    if (abortRef.current) {
      setIsStreaming(false);
      return;
    }

    const mockResponse = generateMockResponse(userMsg, session.appName);
    let content = "";
    for (const char of mockResponse) {
      if (abortRef.current) break;
      content += char;
      updateLastAssistantMessage(sessionId, content, undefined, true);
      await delay(12);
    }
    updateLastAssistantMessage(sessionId, content, undefined, false);
    setIsStreaming(false);
  }

  function handleStop() {
    abortRef.current = true;
    setIsThinking(false);
    setIsStreaming(false);
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Không tìm thấy phiên trò chuyện
      </div>
    );
  }

  const suggestions = FOLLOW_UP_SUGGESTIONS[session.appId] || [
    "Cho tôi biết thêm",
    "Gợi ý khác đi",
    "Cảm ơn nhé!",
  ];
  const showSuggestions =
    !isStreaming &&
    session.messages.length >= 2 &&
    session.messages[session.messages.length - 1]?.role === "assistant";

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="text-xl shrink-0">{session.appIcon}</span>
          <span className="text-sm font-medium text-gray-900 truncate">
            {session.title}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {session.messages.map((msg, idx) => {
            const isLastAssistant =
              msg.role === "assistant" &&
              idx === session.messages.length - 1;
            return (
              <div key={msg.id}>
                {/* Show chain-of-thought before the last assistant message */}
                {isLastAssistant && (
                  <AIChainOfThought appId={session.appId} isActive={isThinking} />
                )}
                {/* Hide thinking indicator when chain-of-thought is already showing */}
                {!(isLastAssistant && isThinking && !msg.content) && (
                  <ChatMessageBubble message={msg} />
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested follow-ups */}
      {showSuggestions && (
        <div className="px-6 pb-2 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <span className="text-[11px] text-gray-400 shrink-0">Gợi ý:</span>
            <Suggestions>
              {suggestions.map((s) => (
                <Suggestion
                  key={s}
                  suggestion={s}
                  onClick={(text) => handleSend(text)}
                  variant="outline"
                  size="sm"
                  className="text-xs text-gray-600 hover:bg-red-50 hover:border-[#EA0029]/30 hover:text-[#EA0029]"
                />
              ))}
            </Suggestions>
          </div>
        </div>
      )}

      {/* Message limit warning */}
      {showWarning && (
        <div className="px-6 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <AlertTriangle size={16} className="shrink-0" />
              <span>
                Bạn còn <strong>{remaining}</strong> tin nhắn miễn phí hôm nay.{" "}
                <a href="/login" className="font-semibold text-[#EA0029] hover:underline">
                  Đăng nhập
                </a>{" "}
                để sử dụng không giới hạn.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Limit reached block */}
      {limitReached && (
        <div className="px-6 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              <Lock size={16} className="shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Đã hết lượt tin nhắn miễn phí hôm nay</p>
                <p className="text-red-600 mt-0.5">Đăng nhập bằng V-ID để tiếp tục sử dụng không giới hạn.</p>
              </div>
              <a
                href="/login"
                className="px-4 py-2 rounded-lg bg-[#EA0029] text-white text-sm font-semibold hover:bg-[#C80023] transition-colors shrink-0"
              >
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI Prompt Input */}
      <div className="border-t border-gray-200 px-6 py-3 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className={`relative rounded-2xl border transition-all duration-200 ${
            input.trim()
              ? "border-[#EA0029]/30 ring-2 ring-[#EA0029]/10 bg-white shadow-sm"
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
                placeholder={limitReached ? "Đăng nhập để tiếp tục..." : `Hỏi ${session.appName} bất cứ điều gì...`}
                rows={1}
                disabled={isStreaming || limitReached}
                className="flex-1 bg-transparent resize-none text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none min-h-[24px] max-h-[120px] disabled:opacity-50"
              />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex items-center gap-1">
                <button
                  disabled={isStreaming}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                  title="Đính kèm file"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  disabled={isStreaming}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                  title="Nhập giọng nói"
                >
                  <Mic size={16} />
                </button>
                <button
                  disabled={isStreaming}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                  title="Tìm trên web"
                >
                  <Globe size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isStreaming && (
                  <button
                    onClick={handleStop}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors"
                  >
                    <Square size={12} />
                    Dừng
                  </button>
                )}
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isStreaming || limitReached}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    input.trim() && !isStreaming && !limitReached
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
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-1.5">
            AI Agent sẽ phân tích và trả lời dựa trên ngữ cảnh cuộc trò chuyện
          </p>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateMockResponse(userMsg: string, appName: string): string {
  return `Tôi hiểu yêu cầu của bạn về "${userMsg.slice(0, 50)}${userMsg.length > 50 ? "..." : ""}".

Với vai trò **${appName}**, tôi rất vui được giúp bạn! Để tôi xử lý yêu cầu.

Đây là những gì tôi có thể cho bạn biết:

- Đây là **phản hồi demo** từ trợ lý AI ${appName}
- Trong thực tế, ứng dụng sẽ kết nối tới các MCP server thật
- AI sẽ gọi các công cụ cụ thể để lấy dữ liệu thời gian thực
- Các widget như bản đồ, playlist, và nhiều hơn sẽ hiển thị trực tiếp

Để xem trải nghiệm tương tác đầy đủ với widget, hãy thử một trong các **câu gợi ý** từ trang chi tiết ứng dụng!

Bạn muốn khám phá điều gì cụ thể không?`;
}
