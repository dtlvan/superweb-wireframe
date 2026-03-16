"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Grid3X3,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Newspaper,
  Search,
  Users,
  LogIn,
  User,
} from "lucide-react";
import { getSessions, subscribe, ChatSession } from "@/lib/chat-store";
import { subscribeAuth, getAuthState } from "@/lib/auth-store";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const sessions = useSyncExternalStore(subscribe, getSessions, getSessions);
  const authState = useSyncExternalStore(subscribeAuth, getAuthState, getAuthState);
  const isGuest = !authState.user;

  if (collapsed) {
    return (
      <div className="w-[52px] bg-gray-50 border-r border-gray-200 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PanelLeft size={18} />
        </button>
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          title="Tra cứu AI"
        >
          <Search size={18} />
        </Link>
        <Link
          href="/apps"
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          title="Trung tâm tiện ích"
        >
          <Grid3X3 size={18} />
        </Link>
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          title="Tin tức VTimes"
        >
          <Newspaper size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[260px] bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <button
          onClick={() => setCollapsed(true)}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PanelLeftClose size={18} />
        </button>
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Plus size={18} />
        </Link>
      </div>

      {/* Tra cứu AI */}
      <div className="px-3 mb-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Search size={18} />
          <span className="text-sm font-medium">Tra cứu AI</span>
        </Link>
      </div>

      {/* Trung tâm tiện ích */}
      <div className="px-3 mb-1">
        <Link
          href="/apps"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname.startsWith("/apps")
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Grid3X3 size={18} />
          <span className="text-sm font-medium">Trung tâm tiện ích</span>
        </Link>
      </div>

      {/* Tin tức VTimes */}
      <div className="px-3 mb-1">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
        >
          <Newspaper size={18} />
          <span className="text-sm font-medium">Tin tức VTimes</span>
        </button>
      </div>

      <div className="px-5 py-2">
        <div className="h-px bg-gray-200" />
      </div>

      {/* Trò chuyện nhóm — brutalism banner */}
      <div className="px-3 mb-2">
        <Link
          href="/group-chat"
          className="block relative rounded-lg border-2 border-gray-900 p-3 group cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          style={{
            backgroundColor: "#C8FF00",
            boxShadow: "4px 4px 0px 0px #111",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md border-2 border-gray-900 bg-gray-900 flex items-center justify-center">
              <Users size={14} className="text-[#C8FF00]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-gray-900 leading-tight uppercase tracking-wide">
                Chat nhóm
              </p>
              <p className="text-[10px] font-bold text-gray-900/60 mt-0.5 uppercase tracking-wider">
                Sắp ra mắt
              </p>
            </div>
            <div className="w-6 h-6 rounded-md border-2 border-gray-900 bg-gray-900 flex items-center justify-center">
              <span className="text-[#C8FF00] text-xs font-black">→</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-5 py-2">
        <div className="h-px bg-gray-200" />
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
          Trò chuyện gần đây
        </p>
        {sessions.length === 0 ? (
          <p className="px-3 py-4 text-sm text-gray-400">
            Chưa có cuộc trò chuyện nào.
          </p>
        ) : (
          <div className="space-y-0.5">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === `/chat/${session.id}`
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base shrink-0">{session.appIcon}</span>
                <span className="truncate">{session.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#EA0029] hover:bg-red-50 transition-colors w-full text-sm font-medium"
          >
            <LogIn size={16} />
            <span>Đăng nhập V-ID</span>
          </Link>
        ) : (
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#EA0029] flex items-center justify-center">
              <User size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{authState.user!.phone}</p>
            </div>
            <Settings size={14} className="text-gray-400 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}
