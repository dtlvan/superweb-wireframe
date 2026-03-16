# V-App Superweb — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-16
**Status:** Wireframe / Interactive Prototype
**Platform:** Web (Desktop-first, responsive)

---

## 1. Product Overview

V-App Superweb is an AI-powered conversational platform that connects users with specialized mini-apps through natural language. Users chat with domain-specific AI assistants (travel, music, food, shopping, etc.) and receive rich, interactive responses including maps, playlists, restaurant cards, weather forecasts, and more.

### 1.1 Goals

- Showcase the concept of an AI-native "super app" aggregating multiple services
- Demonstrate streaming AI responses with chain-of-thought reasoning
- Provide interactive widget rendering within conversation threads
- Support guest access with usage limits to drive V-ID account registration

### 1.2 Target Users

- Vietnamese consumers looking for AI-assisted services
- Existing VinGroup ecosystem users (VinClub members)
- Guest users exploring the platform before committing to registration

---

## 2. User Flows

### 2.1 Guest Flow

```
Landing Page → Browse Apps / Click Suggestion
  → Chat with AI (up to 5 msgs for testing, 20 in production)
    → Warning banner at 3 remaining
    → Block + Login CTA at 0 remaining
      → Login Page → OTP → Unlimited access
```

### 2.2 Login Flow

```
Click "Đăng nhập V-ID" (sidebar or limit banner)
  → Enter phone number
    → Submit → SMS OTP sent (simulated)
      → Enter 6-digit OTP (auto-advance, paste support)
        → Verification (1.5s simulated)
          → Redirect to Home → Full access
```

### 2.3 Chat Flow

```
User selects a prompt or types a message
  → Guest message counter incremented
    → User message displayed
      → Chain-of-thought animation (2.8s, per-app steps)
        → Streaming response (3 chars / 15ms)
          → Widget placeholders replaced with interactive widgets
            → Follow-up suggestions appear
```

### 2.4 Settings Flow

```
Click user avatar/settings icon in sidebar
  → Settings page: Profile, VinClub, Account, Management, Payment
    → Logout → Return to guest mode
```

---

## 3. Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | AI search bar + suggestion grid (6 prompts from different apps) |
| `/login` | Login | V-ID phone + OTP authentication, no sidebar |
| `/apps` | App Directory | Browse 8 mini-apps with search and category filtering |
| `/apps/[id]` | App Detail | App info, features, 3 conversation starters |
| `/chat/[sessionId]` | Chat | Full chat interface with streaming, widgets, chain-of-thought |
| `/settings` | Settings | User profile, VinClub card, account management, logout |
| `/group-chat` | Group Chat | "Coming soon" teaser page |

---

## 4. Mini Apps Catalog

### 4.1 App Registry (8 apps)

| App | Category | Icon | Prompts | Widget Types |
|---|---|---|---|---|
| VinPearl Travel | Du lịch | 🏖️ | Day trips, resorts, activities | map, itinerary |
| Music DJ | Âm nhạc | 🎵 | Lo-fi, V-pop, K-pop playlists | playlist |
| Foodie Finder | Ẩm thực | 🍜 | Restaurant recs, dishes, recipes | restaurant, map |
| ShopSmart | Mua sắm | 🛍️ | Comparisons, deals, specs | shopping |
| FitCoach AI | Sức khỏe | 💪 | Workouts, nutrition, HIIT | itinerary |
| LinguaAI | Giáo dục | 🗣️ | Greetings, conversations, exams | (text only) |
| MovieNight | Giải trí | 🎬 | Genre recs, films, anime | (text only) |
| WeatherWise | Tiện ích | 🌤️ | Forecasts, travel timing, climate | weather |

### 4.2 App Data Structure

```typescript
interface MiniApp {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  longDescription: string;
  rating: number;        // 4.3–4.9
  reviews: number;       // 2,100–15,200
  developer: string;
  prompts: ConversationStarter[];  // 3 per app
  color: string;         // Accent color hex
}
```

---

## 5. Chat & AI Response System

### 5.1 Message Types

| Type | Alignment | Style | Content |
|---|---|---|---|
| User message | Right | Gray bubble | Plain text |
| Assistant message | Left | White, with AI avatar | Markdown + widget placeholders |
| Thinking indicator | Left | Animated dots | Shown during chain-of-thought |

### 5.2 Chain-of-Thought

Each app has 5 custom reasoning steps displayed during the "thinking" phase:

- Steps revealed one-by-one every 700ms
- Collapsible UI (auto-opens during thinking, auto-closes when done)
- Users can manually expand to see completed steps
- Status per step: `complete` | `active` | `pending`

**Example (VinPearl Travel):**
1. Phân tích yêu cầu du lịch
2. Tìm kiếm thông tin điểm đến
3. Truy vấn dữ liệu khách sạn
4. Tạo lịch trình tối ưu
5. Tổng hợp gợi ý

### 5.3 Streaming

- Text streamed 3 characters per 15ms tick
- Widget placeholders (`<<WIDGET:type>>`) injected inline
- Widgets render immediately when their placeholder appears
- Streaming cursor shown until complete

### 5.4 Follow-up Suggestions

After each AI response completes, 3 contextual follow-up suggestions appear as horizontal pills (using AI Elements `<Suggestion>` component).

---

## 6. Widget System

### 6.1 Widget Types (8)

| Type | Description | Height | Key Data |
|---|---|---|---|
| `map` | Interactive map with markers | 350px | Locations, legend, routes |
| `playlist` | Music track listing | 480px | Tracks, mood, duration, BPM |
| `restaurant` | Restaurant recommendation cards | 300px | Rating, price range, specialty |
| `booking` | Reservation interface | 300px | Hotel/venue details |
| `weather` | Forecast display | 300px | Temperature, conditions, humidity |
| `shopping` | Product comparison table | 380px | Products, store prices, specs |
| `itinerary` | Day-by-day schedule | 380px | Days, times, activities |
| `recipe` | Cooking instructions | 400px | Ingredients, steps, prep time |

### 6.2 Widget Rendering

- Browser-like chrome (titlebar with colored dots)
- Content rendered in sandboxed `<iframe>` with `srcDoc`
- Action buttons below each widget (context-specific: "Xem bản đồ", "Nghe nhạc", "Đặt bàn", etc.)
- Expandable "Tải V-App" mobile download prompt

---

## 7. Authentication & Guest Mode

### 7.1 Auth States

| State | Message Limit | Features |
|---|---|---|
| Guest | 5/day (testing) / 20/day (production) | Full app access, limited messages |
| Logged in (V-ID) | Unlimited | Full access, settings, VinClub |

### 7.2 Guest Message Limits

- **Counter:** Tracks messages sent across all chat sessions
- **Warning:** Amber banner when ≤ 3 messages remaining ("Bạn còn X tin nhắn miễn phí")
- **Block:** Red banner at 0 remaining, input disabled, login CTA button
- **Redirect:** Clicking prompts when limit reached → `/login`

### 7.3 Login Page

Replicates V-ID design:
- V-ID logo with watermark background pattern
- Phone number input with validation (9+ digits)
- "Tiếp tục" button → simulated OTP send (1.2s delay)
- 6-digit OTP input with auto-advance and paste support
- "Gửi lại" resend link
- Terms of Service and Privacy Policy links
- "Quay lại" back navigation

### 7.4 User Data

```typescript
interface User {
  phone: string;
  name: string;  // Initially set to phone number
}
```

---

## 8. Settings Page

### 8.1 Sections

| Section | Items |
|---|---|
| Profile Header | Avatar, name, phone number |
| VinClub Card | Diamond tier, VPoint (74), Voucher (5 ưu đãi) |
| Thông tin tài khoản | Tài khoản (manage personal info), Định danh tài khoản (identity verification) |
| Quản lý | Mời bạn bè, Lịch sử trò chuyện |
| Thanh toán | Thẻ và phương thức thanh toán, Lịch sử đơn hàng |
| Actions | Đăng xuất button |

---

## 9. Sidebar Navigation

### 9.1 Structure

| Element | Behavior |
|---|---|
| Collapse toggle | 260px ↔ 52px width |
| New chat button | Navigate to home |
| Tra cứu AI | Home page link |
| Trung tâm tiện ích | App directory link |
| Tin tức VTimes | Placeholder (non-functional) |
| Chat nhóm banner | Brutalism-style "Sắp ra mắt" teaser |
| Chat history | List of recent sessions with app icon + title |
| Footer (guest) | "Đăng nhập V-ID" link |
| Footer (logged in) | Avatar + phone + Settings/Logout icons |

### 9.2 Chat History

- Sessions listed newest first
- Each shows: app emoji icon + auto-generated title (truncated from first message, max 50 chars)
- Active session highlighted with gray background
- Hidden on login page via `AppShell` component

---

## 10. Scripted Conversations

18+ pre-scripted demo conversations with realistic content:

| App | Prompt | Response Summary | Widgets |
|---|---|---|---|
| VinPearl | 3-day Nha Trang trip | Detailed itinerary with landmarks | map + itinerary |
| VinPearl | Resort recommendations | Top 5 resorts with features | map |
| VinPearl | Da Nang weekend | Activities and dining | map + itinerary |
| Music DJ | Lo-fi playlist | 8-track chill playlist | playlist |
| Music DJ | V-pop road trip | Vietnamese pop tracks | playlist |
| Music DJ | K-pop trending | Popular K-pop tracks | playlist |
| Foodie | Best pho in HCMC | Top restaurant recommendations | restaurant + map |
| ShopSmart | iPhone vs Galaxy | Detailed spec comparison | shopping |
| FitCoach | Home workout plan | 4-week progressive program | itinerary |
| LinguaAI | Vietnamese greetings | Basic phrases with pronunciation | (none) |
| WeatherWise | Da Lat forecast | 5-day weather prediction | weather |

Non-scripted messages receive a generic AI response acknowledging the query.

---

## 11. Technical Architecture

### 11.1 Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Components:** AI Elements (chain-of-thought, suggestions), Radix UI, Lucide icons
- **State:** Custom pub/sub stores with `useSyncExternalStore`
- **Fonts:** Geist Sans, Inter

### 11.2 State Management

Two in-memory stores with pub/sub pattern:

**Chat Store** (`chat-store.ts`):
- `sessions[]` — All chat sessions
- `createSession()`, `addMessage()`, `updateLastAssistantMessage()`
- `subscribe()` + `getSessions()` for React integration

**Auth Store** (`auth-store.ts`):
- `snapshot: { user, messageCount }` — Stable reference for React
- `login()`, `logout()`, `recordGuestMessage()`
- `subscribeAuth()` + `getAuthState()` for React integration

### 11.3 Performance

- Route prefetching on home and app detail pages
- Loading skeleton (`loading.tsx`) for instant perceived navigation
- Character-batch streaming (3 chars/tick) for realistic AI feel
- Collapsible sidebar to maximize content area

---

## 12. Design System

### 12.1 Brand Colors

| Token | Value | Usage |
|---|---|---|
| Primary Red | `#EA0029` | CTA buttons, brand accents, AI avatar |
| Dark Red | `#C80023` | Hover state |
| Gray 50–900 | Tailwind defaults | Backgrounds, text, borders |
| App-specific | Per-app hex | App icons, category badges |

### 12.2 Component Patterns

- **Cards:** `rounded-2xl border border-gray-100 shadow-sm`
- **Buttons:** `rounded-xl` or `rounded-lg`, red primary, gray secondary
- **Inputs:** `rounded-xl border` with focus ring in brand red
- **Banners:** `rounded-xl` with semantic background (amber warning, red error)

### 12.3 Animations

| Animation | Usage | Duration |
|---|---|---|
| `fade-in` | Message appearance | 300ms ease-out |
| `ai-pulse` | AI avatar glow | Continuous |
| `progress-slide` | Loading bar | Continuous |
| Chain-of-thought steps | Step reveal | 700ms interval |
| Streaming cursor | Text cursor blink | Continuous |

---

## 13. Placeholder Features (Non-functional)

These UI elements exist but are not yet functional:

- **Voice input** (microphone icon in chat toolbar)
- **File attachments** (paperclip icon in chat toolbar)
- **Web search** (globe icon in chat toolbar)
- **VTimes News** (sidebar navigation item)
- **Group Chat** (teaser page only)
- **Settings sub-pages** (Tài khoản, Định danh, Thanh toán, etc.)
- **VinClub card actions** (VPoint, Voucher navigation)

---

## 14. Future Roadmap

1. **Production message limits** — Increase from 5 to 20 daily messages for guests
2. **Real MCP server connections** — Replace scripted responses with live AI
3. **Group chat** — Multi-user conversations with AI assistants
4. **Voice input** — Speech-to-text for hands-free interaction
5. **File upload** — Share images, documents in conversation
6. **Web search integration** — Ground AI responses with live web data
7. **Payment gateway** — VinClub points, voucher redemption
8. **VTimes news feed** — Integrated news content
9. **Mobile V-App** — Native app with full widget support
10. **Push notifications** — Re-engagement for guest users approaching limits
