"use client";

import { Widget } from "@/lib/types";
import { useState } from "react";
import { ChevronDown, Smartphone, ExternalLink } from "lucide-react";

/* Action labels per widget type */
const WIDGET_ACTIONS: Record<
  string,
  { label: string; icon: string }[]
> = {
  map: [
    { label: "Xem chi tiết bản đồ", icon: "🗺️" },
    { label: "Chỉ đường", icon: "🧭" },
  ],
  playlist: [
    { label: "Nghe nhạc", icon: "▶️" },
    { label: "Lưu playlist", icon: "💾" },
  ],
  restaurant: [
    { label: "Xem thực đơn", icon: "📋" },
    { label: "Đặt bàn", icon: "🪑" },
  ],
  itinerary: [
    { label: "Xem lịch trình đầy đủ", icon: "📅" },
    { label: "Chia sẻ nhóm", icon: "👥" },
  ],
  weather: [
    { label: "Dự báo 7 ngày", icon: "📊" },
    { label: "Cài cảnh báo", icon: "🔔" },
  ],
  shopping: [
    { label: "So sánh giá", icon: "📊" },
    { label: "Mua ngay", icon: "🛒" },
  ],
  booking: [
    { label: "Xem chi tiết", icon: "📄" },
    { label: "Đặt ngay", icon: "✅" },
  ],
  recipe: [
    { label: "Xem công thức", icon: "👨‍🍳" },
    { label: "Lưu món", icon: "❤️" },
  ],
};

function generateWidgetHTML(widget: Widget): string {
  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; color: #333; padding: 16px; }
      .card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid #e5e7eb; }
      .title { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #111; }
      .subtitle { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
    </style>
  `;

  switch (widget.type) {
    case "map":
      return generateMapWidget(widget, baseStyles);
    case "playlist":
      return generatePlaylistWidget(widget, baseStyles);
    case "restaurant":
      return generateRestaurantWidget(widget, baseStyles);
    case "itinerary":
      return generateItineraryWidget(widget, baseStyles);
    case "weather":
      return generateWeatherWidget(widget, baseStyles);
    case "shopping":
      return generateShoppingWidget(widget, baseStyles);
    case "recipe":
      return generateRecipeWidget(widget, baseStyles);
    default:
      return `<html><body>${baseStyles}<div class="card"><p>Widget: ${widget.type}</p></div></body></html>`;
  }
}

function generateMapWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    center: { lat: number; lng: number };
    zoom: number;
    markers: { lat: number; lng: number; label: string; color: string }[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .map-container { position: relative; background: #dbeafe; border-radius: 12px; overflow: hidden; height: 220px; border: 1px solid #e5e7eb; }
      .map-grid { position: absolute; inset: 0; opacity: 0.15; background-image: linear-gradient(rgba(0,0,0,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.15) 1px, transparent 1px); background-size: 40px 40px; }
      .map-label { position: absolute; top: 8px; left: 8px; background: rgba(255,255,255,0.9); color: #333; padding: 4px 10px; border-radius: 8px; font-size: 11px; backdrop-filter: blur(4px); border: 1px solid #e5e7eb; }
      .marker { position: absolute; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); animation: drop 0.4s ease-out; }
      .marker-label { position: absolute; top: -28px; left: 50%; transform: translateX(-50%) rotate(45deg); white-space: nowrap; font-size: 10px; background: rgba(0,0,0,0.75); color: #fff; padding: 2px 6px; border-radius: 4px; pointer-events: none; }
      @keyframes drop { from { transform: rotate(-45deg) translateY(-20px); opacity: 0; } to { transform: rotate(-45deg) translateY(0); opacity: 1; } }
      .legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; }
      .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
    </style>
  </head><body>
    <div class="title">📍 ${widget.title}</div>
    <div class="map-container">
      <div class="map-grid"></div>
      <div class="map-label">${data.center.lat.toFixed(2)}°N, ${data.center.lng.toFixed(2)}°E</div>
      ${data.markers
        .map(
          (m, i) => `
        <div class="marker" style="background:${m.color}; left:${15 + i * 22}%; top:${25 + ((i * 37) % 50)}%; animation-delay:${i * 0.15}s">
          <div class="marker-label">${m.label}</div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="legend">
      ${data.markers
        .map(
          (m) =>
            `<div class="legend-item"><div class="legend-dot" style="background:${m.color}"></div>${m.label}</div>`
        )
        .join("")}
    </div>
  </body></html>`;
}

function generatePlaylistWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    tracks: {
      title: string;
      artist: string;
      duration: string;
      bpm: number;
    }[];
    mood: string;
    totalDuration: string;
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .playlist-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .playlist-art { width: 64px; height: 64px; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 28px; }
      .playlist-info { flex: 1; }
      .playlist-info h2 { font-size: 15px; color: #111; margin-bottom: 4px; }
      .playlist-info p { font-size: 12px; color: #6b7280; }
      .track { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; transition: background 0.2s; cursor: pointer; }
      .track:hover { background: #f3f4f6; }
      .track-num { font-size: 12px; color: #9ca3af; width: 20px; text-align: center; }
      .track-info { flex: 1; }
      .track-title { font-size: 13px; color: #333; }
      .track-artist { font-size: 11px; color: #6b7280; }
      .track-duration { font-size: 12px; color: #9ca3af; }
      .track-bpm { font-size: 10px; color: #667eea; background: rgba(102,126,234,0.1); padding: 1px 6px; border-radius: 8px; }
      .play-btn { width: 36px; height: 36px; border-radius: 50%; background: #1DB954; border: none; color: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
      .eq-bar { display: inline-block; width: 3px; background: #1DB954; margin: 0 1px; border-radius: 2px; animation: eq 0.8s ease-in-out infinite alternate; }
      @keyframes eq { 0% { height: 4px; } 100% { height: 16px; } }
    </style>
  </head><body>
    <div class="playlist-header">
      <div class="playlist-art">🎵</div>
      <div class="playlist-info">
        <h2>${widget.title}</h2>
        <p>${data.tracks.length} tracks · ${data.totalDuration} · ${data.mood}</p>
      </div>
      <button class="play-btn">▶</button>
    </div>
    ${data.tracks
      .map(
        (t, i) => `
      <div class="track">
        <div class="track-num">${i + 1}</div>
        <div class="track-info">
          <div class="track-title">${t.title}</div>
          <div class="track-artist">${t.artist}</div>
        </div>
        <div class="track-bpm">${t.bpm} BPM</div>
        <div class="track-duration">${t.duration}</div>
      </div>
    `
      )
      .join("")}
    <div class="controls">
      <span style="color:#9ca3af;font-size:20px">⏮</span>
      <button class="play-btn" style="width:44px;height:44px;font-size:20px">▶</button>
      <span style="color:#9ca3af;font-size:20px">⏭</span>
    </div>
  </body></html>`;
}

function generateRestaurantWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    restaurants: {
      name: string;
      rating: number;
      price: string;
      specialty: string;
      hours: string;
      distance: string;
    }[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .rest-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; border: 1px solid #e5e7eb; display: flex; gap: 12px; }
      .rest-icon { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
      .rest-info { flex: 1; }
      .rest-name { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
      .rest-meta { display: flex; gap: 10px; font-size: 11px; color: #6b7280; margin-bottom: 6px; }
      .rest-spec { font-size: 12px; color: #4b5563; }
      .stars { color: #f59e0b; }
    </style>
  </head><body>
    <div class="title">🍽️ ${widget.title}</div>
    ${data.restaurants
      .map(
        (r) => `
      <div class="rest-card">
        <div class="rest-icon">🍜</div>
        <div class="rest-info">
          <div class="rest-name">${r.name}</div>
          <div class="rest-meta">
            <span class="stars">${"★".repeat(Math.floor(r.rating))}${r.rating % 1 >= 0.5 ? "½" : ""}</span>
            <span>${r.rating}</span>
            <span>·</span>
            <span>${r.price} VNĐ</span>
            <span>·</span>
            <span>${r.distance}</span>
          </div>
          <div class="rest-spec">${r.specialty} · ${r.hours}</div>
        </div>
      </div>
    `
      )
      .join("")}
  </body></html>`;
}

function generateItineraryWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    days: {
      day: number;
      title: string;
      items: { time: string; activity: string; icon: string }[];
    }[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .day-header { font-size: 14px; font-weight: 600; color: #111; margin: 16px 0 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
      .day-header:first-child { margin-top: 0; }
      .timeline-item { display: flex; gap: 12px; padding: 6px 0; align-items: center; }
      .timeline-time { font-size: 12px; color: #667eea; font-weight: 500; min-width: 50px; }
      .timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: #667eea; flex-shrink: 0; }
      .timeline-text { font-size: 13px; color: #4b5563; }
      .timeline-icon { font-size: 16px; }
    </style>
  </head><body>
    <div class="title">📋 ${widget.title}</div>
    ${data.days
      .map(
        (d) => `
      <div class="day-header">Day ${d.day}: ${d.title}</div>
      ${d.items
        .map(
          (item) => `
        <div class="timeline-item">
          <div class="timeline-time">${item.time}</div>
          <div class="timeline-dot"></div>
          <div class="timeline-icon">${item.icon}</div>
          <div class="timeline-text">${item.activity}</div>
        </div>
      `
        )
        .join("")}
    `
      )
      .join("")}
  </body></html>`;
}

function generateWeatherWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    location: string;
    days: {
      day: string;
      high: number;
      low: number;
      condition: string;
      icon: string;
      humidity: number;
      rain: number;
    }[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .weather-header { text-align: center; margin-bottom: 16px; }
      .weather-location { font-size: 14px; color: #6b7280; }
      .weather-cards { display: flex; gap: 12px; }
      .weather-card { flex: 1; background: #fff; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e5e7eb; }
      .weather-icon { font-size: 40px; margin: 8px 0; }
      .weather-day { font-size: 14px; font-weight: 600; color: #111; }
      .weather-condition { font-size: 12px; color: #6b7280; margin: 4px 0 12px; }
      .weather-temps { font-size: 20px; font-weight: 700; color: #111; }
      .weather-temps span { font-size: 14px; color: #9ca3af; font-weight: 400; }
      .weather-detail { display: flex; justify-content: center; gap: 16px; margin-top: 12px; font-size: 11px; color: #6b7280; }
    </style>
  </head><body>
    <div class="title">🌤️ ${widget.title}</div>
    <div class="weather-header">
      <div class="weather-location">📍 ${data.location}</div>
    </div>
    <div class="weather-cards">
      ${data.days
        .map(
          (d) => `
        <div class="weather-card">
          <div class="weather-day">${d.day}</div>
          <div class="weather-icon">${d.icon}</div>
          <div class="weather-condition">${d.condition}</div>
          <div class="weather-temps">${d.high}° <span>/ ${d.low}°</span></div>
          <div class="weather-detail">
            <span>💧 ${d.humidity}%</span>
            <span>🌧️ ${d.rain}%</span>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </body></html>`;
}

function generateShoppingWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    products: {
      name: string;
      prices: { store: string; price: string; url: string }[];
      image: string;
    }[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .product { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid #e5e7eb; }
      .product-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .product-icon { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, #ec4899, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 20px; }
      .product-name { font-size: 14px; font-weight: 600; color: #111; }
      .price-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 8px; margin-bottom: 4px; font-size: 13px; }
      .price-row:hover { background: #f3f4f6; }
      .store-name { color: #4b5563; }
      .price { color: #059669; font-weight: 600; }
      .best-price { background: rgba(5,150,105,0.06); }
      .best-badge { font-size: 10px; color: #059669; background: rgba(5,150,105,0.1); padding: 1px 6px; border-radius: 8px; margin-left: 6px; }
    </style>
  </head><body>
    <div class="title">🛍️ ${widget.title}</div>
    ${data.products
      .map(
        (p) => `
      <div class="product">
        <div class="product-header">
          <div class="product-icon">${p.image === "iphone" ? "📱" : "📱"}</div>
          <div class="product-name">${p.name}</div>
        </div>
        ${p.prices
          .map(
            (pr, i) => `
          <div class="price-row ${i === p.prices.length - 1 ? "best-price" : ""}">
            <span class="store-name">${pr.store}</span>
            <span>
              <span class="price">${pr.price}</span>
              ${i === p.prices.length - 1 ? '<span class="best-badge">Best Deal</span>' : ""}
            </span>
          </div>
        `
          )
          .join("")}
      </div>
    `
      )
      .join("")}
  </body></html>`;
}

function generateRecipeWidget(widget: Widget, baseStyles: string): string {
  const data = widget.data as {
    name: string;
    servings: string;
    prepTime: string;
    cookTime: string;
    ingredients: { item: string; amount: string }[];
    steps: string[];
  };
  return `<!DOCTYPE html><html><head>${baseStyles}
    <style>
      .recipe-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
      .recipe-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #f97316, #ef4444); display: flex; align-items: center; justify-content: center; font-size: 28px; }
      .recipe-title { font-size: 16px; font-weight: 700; color: #111; margin-bottom: 4px; }
      .recipe-meta { display: flex; gap: 12px; font-size: 11px; color: #6b7280; }
      .recipe-meta span { display: flex; align-items: center; gap: 4px; }
      .section-title { font-size: 14px; font-weight: 600; color: #111; margin: 16px 0 8px; display: flex; align-items: center; gap: 6px; }
      .ingredient { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #f3f4f6; font-size: 13px; }
      .ingredient-name { color: #4b5563; }
      .ingredient-amount { color: #6b7280; font-weight: 500; }
      .step { display: flex; gap: 10px; padding: 8px 0; }
      .step-num { width: 24px; height: 24px; border-radius: 50%; background: #f97316; color: #fff; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .step-text { font-size: 13px; color: #4b5563; line-height: 1.5; }
    </style>
  </head><body>
    <div class="recipe-header">
      <div class="recipe-icon">👨‍🍳</div>
      <div>
        <div class="recipe-title">${data.name}</div>
        <div class="recipe-meta">
          <span>🍽️ ${data.servings}</span>
          <span>⏱️ Chuẩn bị: ${data.prepTime}</span>
          <span>🔥 Nấu: ${data.cookTime}</span>
        </div>
      </div>
    </div>
    <div class="section-title">📝 Nguyên liệu</div>
    ${data.ingredients.map((ing) => `
      <div class="ingredient">
        <span class="ingredient-name">${ing.item}</span>
        <span class="ingredient-amount">${ing.amount}</span>
      </div>
    `).join("")}
    <div class="section-title">👨‍🍳 Các bước thực hiện</div>
    ${data.steps.map((step, i) => `
      <div class="step">
        <div class="step-num">${i + 1}</div>
        <div class="step-text">${step}</div>
      </div>
    `).join("")}
  </body></html>`;
}

const WIDGET_HEIGHT: Record<string, number> = {
  map: 350,
  playlist: 480,
  restaurant: 300,
  itinerary: 380,
  weather: 300,
  shopping: 380,
  booking: 300,
  recipe: 400,
};

export function WidgetFrame({ widget }: { widget: Widget }) {
  const height = WIDGET_HEIGHT[widget.type] || 300;
  const html = generateWidgetHTML(widget);
  const actions = WIDGET_ACTIONS[widget.type] || [{ label: "Xem chi tiết", icon: "📄" }];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-500 ml-2">{widget.title}</span>
      </div>

      {/* Widget iframe */}
      <iframe
        srcDoc={html}
        className="w-full border-0"
        style={{ height }}
        sandbox="allow-scripts allow-same-origin"
        title={widget.title}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-200">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => setExpanded((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              expanded
                ? "bg-violet-100 text-violet-700"
                : "bg-gray-100 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
            <ExternalLink size={10} className="ml-0.5 opacity-50" />
          </button>
        ))}
      </div>

      {/* Expandable V-App mobile prompt */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 bg-gradient-to-r from-violet-50 to-blue-50 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
              <Smartphone size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">
                Mở trên V-App Mobile
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Tải ứng dụng V-App để xem chi tiết đầy đủ, tương tác trực tiếp và nhận thông báo theo thời gian thực.
              </p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
                  <Smartphone size={12} />
                  Tải V-App
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown size={12} className="rotate-180" />
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
