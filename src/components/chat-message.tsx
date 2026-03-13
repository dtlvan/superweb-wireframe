"use client";

import { ChatMessage as ChatMessageType } from "@/lib/types";
import { WidgetFrame } from "./widget-renderer";
import { useEffect, useRef, useState } from "react";

function parseMarkdown(text: string): string {
  let html = text;
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-gray-900 mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 mt-5 mb-3">$1</h1>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-pink-600">$1</code>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-gray-200 my-4" />');
  // List items
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-600 mb-1">$1</li>');
  // Table
  html = html.replace(
    /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
    (_, header, body) => {
      const headers = header.split("|").map((h: string) => h.trim()).filter(Boolean);
      const rows = body.trim().split("\n").map((row: string) =>
        row.split("|").map((c: string) => c.trim()).filter(Boolean)
      );
      return `<div class="overflow-x-auto my-3"><table class="w-full text-sm border-collapse">
        <thead><tr>${headers.map((h: string) => `<th class="text-left px-3 py-2 border-b border-gray-200 text-gray-500 font-medium">${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row: string[]) => `<tr>${row.map((c: string) => `<td class="px-3 py-2 border-b border-gray-100 text-gray-600">${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    }
  );
  // Line breaks
  html = html.replace(/\n\n/g, '<div class="mb-3"></div>');
  html = html.replace(/\n/g, "<br/>");
  return html;
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

  // Split content by widget placeholders
  const parts = message.content.split(/<<WIDGET:\w+>>/);
  let widgetIndex = 0;

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
          AI
        </div>
        <div className="flex-1 min-w-0">
          {parts.map((part, i) => (
            <div key={i}>
              {part && (
                <div
                  className="text-[15px] text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(part) }}
                />
              )}
              {message.widgets &&
                widgetIndex < message.widgets.length &&
                i < parts.length - 1 && (
                  <WidgetFrame widget={message.widgets[widgetIndex++]} />
                )}
            </div>
          ))}
          {message.isStreaming && (
            <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
