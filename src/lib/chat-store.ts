"use client";

import { ChatMessage, Widget } from "./types";

export interface ChatSession {
  id: string;
  appId: string;
  appName: string;
  appIcon: string;
  title: string;
  promptId?: string;
  messages: ChatMessage[];
  createdAt: Date;
}

let sessions: ChatSession[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getSessions() {
  return sessions;
}

export function getSession(id: string) {
  return sessions.find((s) => s.id === id);
}

/** Truncate to a short title from user's first message */
function summarizeTitle(text: string, maxLen = 50): string {
  const clean = text.replace(/\n/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

export function createSession(
  appId: string,
  appName: string,
  appIcon: string,
  firstMessage?: string,
  promptId?: string
): string {
  const id = `chat-${Date.now()}`;
  sessions = [
    {
      id,
      appId,
      appName,
      appIcon,
      title: firstMessage ? summarizeTitle(firstMessage) : appName,
      promptId,
      messages: [],
      createdAt: new Date(),
    },
    ...sessions,
  ];
  notify();
  return id;
}

export function addMessage(sessionId: string, message: ChatMessage) {
  sessions = sessions.map((s) => {
    if (s.id !== sessionId) return s;
    // Prevent duplicate messages
    if (s.messages.some((m) => m.id === message.id)) return s;
    return { ...s, messages: [...s.messages, message] };
  });
  notify();
}

export function updateLastAssistantMessage(
  sessionId: string,
  content: string,
  widgets?: Widget[],
  isStreaming?: boolean
) {
  sessions = sessions.map((s) => {
    if (s.id !== sessionId) return s;
    const msgs = [...s.messages];
    const lastIdx = msgs.length - 1;
    if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
      msgs[lastIdx] = {
        ...msgs[lastIdx],
        content,
        widgets: widgets || msgs[lastIdx].widgets,
        isStreaming,
      };
    }
    return { ...s, messages: msgs };
  });
  notify();
}
