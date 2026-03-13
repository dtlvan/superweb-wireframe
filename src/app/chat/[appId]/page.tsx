"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Send, Square } from "lucide-react";
import {
  getSession,
  getSessions,
  subscribe,
  addMessage,
  updateLastAssistantMessage,
} from "@/lib/chat-store";
import { getScriptedResponse } from "@/lib/scripted-conversations";
import { ChatMessageBubble } from "@/components/chat-message";
import { Widget } from "@/lib/types";

let msgCounter = 0;
function nextMsgId() {
  return `msg-${Date.now()}-${++msgCounter}`;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.appId as string;
  const promptId = searchParams.get("promptId");

  const sessions = useSyncExternalStore(subscribe, getSessions, getSessions);
  const session = getSession(sessionId);

  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions]);

  // Auto-trigger scripted response for prompt starters
  useEffect(() => {
    if (!promptId || startedRef.current || !session) return;
    if (session.messages.length !== 1) return;
    startedRef.current = true;
    streamScriptedResponse(promptId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptId, session]);

  async function streamScriptedResponse(pId: string) {
    const scripted = getScriptedResponse(pId);
    if (!scripted || !session) return;

    setIsStreaming(true);
    abortRef.current = false;

    // Add empty assistant message
    addMessage(sessionId, {
      id: nextMsgId(),
      role: "assistant",
      content: "",
      widgets: [],
      isStreaming: true,
    });

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

  async function handleSend() {
    if (!input.trim() || isStreaming || !session) return;

    const userMsg = input.trim();
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
    setIsStreaming(false);
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Không tìm thấy phiên trò chuyện
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-3 shrink-0">
        <span className="text-xl">{session.appIcon}</span>
        <span className="text-sm font-medium text-gray-900">
          {session.appName}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          Trợ lý AI
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {session.messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 p-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Nhắn tin cho ${session.appName}...`}
              rows={1}
              className="flex-1 bg-transparent resize-none text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none min-h-[24px] max-h-[120px]"
            />
            {isStreaming ? (
              <button
                onClick={handleStop}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors shrink-0"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-30 disabled:hover:bg-gray-900 transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Phản hồi AI là bản demo kịch bản. Chuyển sang API thật trong cài đặt.
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
