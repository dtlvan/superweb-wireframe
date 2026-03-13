"use client";

import { ChatMessage as ChatMessageType } from "@/lib/types";
import { WidgetFrame } from "./widget-renderer";
import { Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";

/* Animated AI avatar with sparkle effect */
function AIAvatar({ isStreaming }: { isStreaming?: boolean }) {
  return (
    <div className="relative shrink-0 mt-1">
      <div
        className={`w-8 h-8 rounded-full bg-[#EA0029] flex items-center justify-center shadow-sm ${
          isStreaming ? "animate-[ai-pulse_2s_ease-in-out_infinite]" : ""
        }`}
      >
        <Sparkles size={14} className="text-white" />
      </div>
      {isStreaming && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse" />
      )}
    </div>
  );
}

/* Thinking/typing indicator shown while AI is generating with no content yet */
export function AIThinkingIndicator() {
  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <AIAvatar isStreaming />
        <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#EA0029] rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" />
            <span className="w-2 h-2 bg-[#EA0029]/60 rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
            <span className="w-2 h-2 bg-[#EA0029]/30 rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
          </div>
          <span className="text-xs text-gray-400 ml-2">AI đang suy nghĩ...</span>
        </div>
      </div>
    </div>
  );
}

export function ChatMessageBubble({
  message,
}: {
  message: ChatMessageType;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[80%] bg-gray-100 rounded-2xl px-4 py-3 text-gray-900 text-[15px]">
          {message.content}
        </div>
      </div>
    );
  }

  // Show thinking indicator if streaming but no content yet
  if (message.isStreaming && !message.content) {
    return <AIThinkingIndicator />;
  }

  // Split content by widget placeholders
  const parts = message.content.split(/<<WIDGET:\w+>>/);
  let widgetIndex = 0;

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <AIAvatar isStreaming={message.isStreaming} />
        <div className="flex-1 min-w-0">
          {parts.map((part, i) => (
            <div key={i}>
              {part && (
                <div className="text-[15px] text-gray-600 leading-relaxed">
                  <Streamdown
                    isAnimating={message.isStreaming}
                  >
                    {part}
                  </Streamdown>
                </div>
              )}
              {message.widgets &&
                widgetIndex < message.widgets.length &&
                i < parts.length - 1 && (
                  <WidgetFrame widget={message.widgets[widgetIndex++]} />
                )}
            </div>
          ))}
          {message.isStreaming && (
            <span className="inline-flex items-center gap-1 mt-1">
              <span className="w-2 h-5 bg-[#EA0029] rounded-sm animate-pulse" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
