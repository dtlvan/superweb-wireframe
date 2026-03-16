"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Shield,
  UserPlus,
  Clock,
  Wallet,
  Receipt,
  ChevronRight,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { subscribeAuth, getAuthState, logout } from "@/lib/auth-store";

interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  href?: string;
}

function SettingsRow({ icon, label, description }: SettingsItem) {
  return (
    <button className="flex items-center gap-4 w-full px-4 py-3.5 hover:bg-gray-50 transition-colors text-left">
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400 shrink-0" />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const authState = useSyncExternalStore(subscribeAuth, getAuthState, getAuthState);
  const user = authState.user;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-lg mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Cài đặt</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EA0029] flex items-center justify-center">
              <User size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900">
                {user?.name || "Khách"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.phone || "Chưa đăng nhập"}
              </p>
            </div>
          </div>

          {/* VinClub Card */}
          {user && (
            <div className="px-5 pb-4">
              <div className="flex items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-4">
                <div className="shrink-0">
                  <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-300 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white tracking-wider uppercase">VinClub</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1.5 text-center">
                    Diamond &gt;
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <button className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs font-semibold text-white">VPoint</p>
                      <p className="text-xs text-gray-300 flex items-center gap-1">
                        <span className="inline-block w-3.5 h-3.5 rounded-full bg-yellow-400" />
                        74
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                  <div className="h-px bg-gray-600" />
                  <button className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs font-semibold text-white">Voucher</p>
                      <p className="text-xs text-gray-300 flex items-center gap-1">
                        <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#EA0029] text-[8px] text-white flex items-center justify-center font-bold">%</span>
                        5 ưu đãi
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thông tin tài khoản */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <p className="px-4 pt-4 pb-1 text-sm font-semibold text-gray-900">
            Thông tin tài khoản
          </p>
          <SettingsRow
            icon={<User size={18} />}
            label="Tài khoản"
            description="Quản lý thông tin cá nhân"
          />
          <div className="mx-4 h-px bg-gray-100" />
          <SettingsRow
            icon={<Shield size={18} />}
            label="Định danh tài khoản"
            description="Xác minh danh tính"
          />
        </div>

        {/* Quản lý */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <p className="px-4 pt-4 pb-1 text-sm font-semibold text-gray-900">
            Quản lý
          </p>
          <SettingsRow
            icon={<UserPlus size={18} />}
            label="Mời bạn bè"
            description="Chia sẻ ứng dụng với bạn bè"
          />
          <div className="mx-4 h-px bg-gray-100" />
          <SettingsRow
            icon={<Clock size={18} />}
            label="Lịch sử trò chuyện"
            description="Lịch sử tra cứu với V-AI"
          />
        </div>

        {/* Thanh toán */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <p className="px-4 pt-4 pb-1 text-sm font-semibold text-gray-900">
            Thanh toán
          </p>
          <SettingsRow
            icon={<CreditCard size={18} />}
            label="Thẻ và phương thức thanh toán"
            description="Quản lý thanh toán"
          />
          <div className="mx-4 h-px bg-gray-100" />
          <SettingsRow
            icon={<Receipt size={18} />}
            label="Lịch sử đơn hàng"
            description="Trạng thái đơn hàng"
          />
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-[#EA0029] font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          V-App Superweb v1.0.0
        </p>
      </div>
    </div>
  );
}
