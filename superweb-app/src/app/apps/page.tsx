"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { miniApps, categories } from "@/lib/apps-data";

export default function AppsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const filtered = miniApps.filter((app) => {
    const matchSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "Tất cả" || app.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Trung tâm tiện ích</h1>
          <p className="text-gray-500">
            Khám phá các ứng dụng AI hỗ trợ du lịch, âm nhạc, ẩm thực và nhiều hơn
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm ứng dụng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: app.color + "20" }}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{app.category}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs text-gray-500">{app.rating}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {app.reviews.toLocaleString()} đánh giá
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {app.developer}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
