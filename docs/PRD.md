# V-App Superweb — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-16
**Author:** Product Team
**Status:** In Development (Wireframe Complete)

---

## 1. Executive Summary

V-App Superweb is an AI-powered super app that unifies multiple daily services — travel planning, music discovery, restaurant finding, shopping, fitness, education, entertainment, and weather — into a single conversational interface. Instead of switching between dozens of separate apps, users simply ask a question and receive rich, actionable answers with interactive elements like maps, playlists, booking forms, and price comparisons.

The platform lowers the barrier to entry by allowing **guest access without registration**. Guests can freely explore and chat with AI assistants up to a daily limit, after which they are prompted to create a **V-ID account** via phone number verification. This freemium model drives organic account growth while giving users a genuine taste of the product's value before committing.

**Key differentiators:**
- One conversational interface replacing 8+ standalone apps
- AI "thinks out loud" with visible reasoning steps, building user trust
- Rich interactive widgets embedded directly in the chat (maps, playlists, restaurant cards, etc.)
- Zero-friction onboarding — use immediately as a guest, sign up when ready
- Deep integration with VinGroup ecosystem (VinClub membership, VPoint rewards, vouchers)

---

## 2. Customer Problems

### 2.1 App Fatigue
Vietnamese consumers juggle 10-20+ apps for everyday tasks: one for travel, one for music, one for food delivery, one for shopping deals. Each app requires separate registration, separate learning curves, and separate notification streams. Users want **one place** to handle common daily needs.

### 2.2 Information Overload
When planning a trip, finding a restaurant, or comparing products, users must sift through reviews, blogs, and comparison sites. They want **curated, personalized answers** — not 10 blue links. Current search experiences don't understand context or provide actionable next steps.

### 2.3 Registration Friction
Most apps require account creation before showing any value. Users abandon onboarding flows when forced to register before understanding what the product offers. They want to **try before committing**.

### 2.4 Trust in AI
Users are skeptical of AI-generated answers. When an AI says "this is the best hotel," users wonder: *How did it decide that? Is it just making things up?* They need **transparency in AI reasoning** to trust the recommendations.

### 2.5 Fragmented Loyalty Programs
VinGroup ecosystem users have VPoint rewards, VinClub membership tiers, and vouchers scattered across different touchpoints. They want a **single hub** to see their benefits and use them across services.

---

## 3. Solutions

### 3.1 Unified AI Conversation Hub
Users interact with 8 specialized AI assistants through a single chat interface. Each assistant is an expert in its domain:

| Assistant | What It Solves | Example Outcome |
|---|---|---|
| VinPearl Travel | Trip planning & booking | 3-day Nha Trang itinerary with map, hotel suggestions |
| Music DJ | Mood-based music discovery | Curated lo-fi study playlist with playback |
| Foodie Finder | Restaurant & recipe discovery | Top phở restaurants in HCMC with ratings & directions |
| ShopSmart | Product comparison & deals | iPhone vs Galaxy side-by-side specs & best prices |
| FitCoach AI | Workout & nutrition planning | 4-week personalized home workout program |
| LinguaAI | Language learning | Interactive Vietnamese conversation practice |
| MovieNight | Entertainment recommendations | Personalized anime suggestions based on preferences |
| WeatherWise | Weather-aware activity planning | 5-day Da Lat forecast with activity suggestions |

### 3.2 Interactive Widgets in Chat
AI responses aren't just text — they include rich, actionable widgets:

- **Maps** with marked locations and directions
- **Playlists** users can browse and play
- **Restaurant cards** with ratings, hours, and booking
- **Price comparison tables** across stores
- **Itineraries** with day-by-day schedules
- **Weather forecasts** with visual conditions
- **Recipes** with ingredients and step-by-step instructions

### 3.3 Guest-First Onboarding
Users start using the app immediately without any registration:

1. **Day 1:** User discovers the app, tries 2-3 AI conversations as a guest
2. **Approaching limit:** A gentle warning appears: *"Bạn còn 5 tin nhắn miễn phí hôm nay"*
3. **Limit reached:** A clear prompt explains the value of signing up with a one-tap login CTA
4. **Registration:** Quick V-ID phone verification (enter number → receive OTP → done)
5. **Post-login:** Unlimited access, chat history preserved, VinClub benefits unlocked

### 3.4 Transparent AI Reasoning
When the AI processes a request, users see a **chain-of-thought** display showing each reasoning step:

> *Phân tích yêu cầu du lịch → Tìm kiếm điểm đến → Truy vấn dữ liệu khách sạn → Tạo lịch trình tối ưu → Tổng hợp gợi ý*

This collapsible panel opens during thinking and auto-closes when the answer arrives. Users can expand it anytime to review how the AI reached its conclusion. Each app has domain-specific reasoning steps, making the AI feel like a genuine specialist rather than a generic chatbot.

### 3.5 VinClub Integration
Logged-in users see their VinClub membership status, VPoint balance, and available vouchers directly in the settings page. Future phases will allow spending VPoints and redeeming vouchers within AI-assisted transactions (booking hotels, ordering food, purchasing products).

---

## 4. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **AI hallucination** — AI provides incorrect information (wrong hotel prices, outdated restaurant hours) | High — erodes user trust | Medium | Chain-of-thought transparency, source attribution in responses, human-curated data for critical info (pricing, availability) |
| **Guest abuse** — Users bypass message limits with multiple browser sessions | Medium — revenue loss | Medium | Device fingerprinting, IP-based rate limiting, adjust daily limit based on abuse patterns |
| **Low conversion from guest to registered** | High — growth depends on V-ID signups | Medium | A/B test limit thresholds (15 vs 20 vs 25), test warning timing, offer incentive (bonus VPoints on registration) |
| **Widget rendering failures** — Maps/playlists don't load correctly on certain devices | Medium — broken experience | Low | Progressive enhancement: show text fallback if widget fails, test across top 10 devices in Vietnam market |
| **Data privacy concerns** — Users reluctant to share phone number | Medium — registration friction | Medium | Clearly communicate data policy, V-ID is an existing trusted brand, offer clear value proposition before asking for login |
| **MCP server reliability** — Backend services for real-time data (weather, prices, availability) go down | High — core functionality broken | Low | Graceful degradation with cached data, clear error messaging, fallback to general knowledge responses |
| **Scope creep on mini-apps** — Trying to make each mini-app too feature-rich | Medium — delays launch | High | Launch with 8 apps at conversational depth, defer transactional features (booking, payment) to Phase 2 |

---

## 5. Epics & User Stories

### Epic 1: AI Chat Experience

> *As a user, I can chat with specialized AI assistants and receive helpful, interactive responses.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 1.1 | As a user, I can browse AI mini-apps and choose one to chat with | App directory shows all 8 apps with search, category filter, ratings; clicking an app shows detail page with conversation starters |
| 1.2 | As a user, I can start a conversation using suggested prompts | Each app has 3 starter prompts; clicking one opens a chat and triggers an AI response |
| 1.3 | As a user, I can type free-form questions to any AI assistant | Text input with send button; AI responds with contextual answer; supports Enter to send, Shift+Enter for newline |
| 1.4 | As a user, I can see the AI's reasoning process while it thinks | Chain-of-thought panel shows 5 domain-specific steps; auto-opens during thinking, auto-closes when done; users can expand/collapse manually |
| 1.5 | As a user, I can see AI responses stream in real-time | Text appears progressively (not all at once); streaming cursor visible during generation |
| 1.6 | As a user, I can interact with rich widgets in AI responses | Maps show locations with markers; playlists list tracks; restaurant cards show ratings/hours; all widgets have contextual action buttons |
| 1.7 | As a user, I can see follow-up suggestions after each AI response | 3 contextual suggestion pills appear after the AI finishes; clicking one sends that message |
| 1.8 | As a user, I can stop an AI response mid-stream | "Dừng" button appears during streaming; clicking it immediately stops the response |

### Epic 2: Guest Mode & Onboarding

> *As a new visitor, I can explore the full app without registering, and I'm guided to sign up when I get value.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 2.1 | As a guest, I can use all features without creating an account | No login required to browse apps, start chats, or view responses; full functionality up to daily message limit |
| 2.2 | As a guest, I receive a warning when approaching my daily message limit | Amber banner appears above input: "Bạn còn X tin nhắn miễn phí hôm nay. Đăng nhập để sử dụng không giới hạn." |
| 2.3 | As a guest, I'm prompted to register when I hit the daily limit | Red banner with login CTA; input field disabled with "Đăng nhập để tiếp tục..." placeholder; clicking any prompt redirects to login |
| 2.4 | As a guest, my message usage is tracked across all chat sessions | Counter increments for starter prompts, home page suggestions, and typed messages across all sessions |

### Epic 3: V-ID Authentication

> *As a user, I can quickly register/login using my phone number via V-ID.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 3.1 | As a user, I can enter my phone number to start login | V-ID branded login page; phone input with validation (9+ digits); "Tiếp tục" button sends OTP |
| 3.2 | As a user, I can verify my identity with SMS OTP | 6-digit OTP input with auto-advance between fields; paste support for full code; "Gửi lại" resend option |
| 3.3 | As a user, I'm redirected to the app after successful login | After OTP verification, redirect to home page; sidebar updates to show user info; message limit removed |
| 3.4 | As a user, I can navigate back from login without losing context | "Quay lại" button returns to previous page |

### Epic 4: Account & Settings

> *As a logged-in user, I can manage my account, view my VinClub benefits, and control my preferences.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 4.1 | As a user, I can access settings from the sidebar | Clicking avatar/name or settings icon navigates to settings page |
| 4.2 | As a user, I can see my profile information | Settings shows name, phone number, avatar |
| 4.3 | As a user, I can see my VinClub membership and rewards | VinClub card shows tier (Diamond), VPoint balance, and voucher count |
| 4.4 | As a user, I can manage my account details | Sections for personal info, identity verification, invite friends, chat history, payment methods, order history |
| 4.5 | As a user, I can log out | "Đăng xuất" button clears session and returns to guest mode |

### Epic 5: Navigation & Discovery

> *As a user, I can easily navigate between features and find what I need.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 5.1 | As a user, I have a sidebar for quick navigation | Collapsible sidebar with links to AI search, app directory, news, and chat history |
| 5.2 | As a user, I can see my recent chat sessions | Sidebar lists all sessions with app icon and auto-generated title from first message |
| 5.3 | As a user, I can start a new conversation from anywhere | "+" button in sidebar header or home page search bar |
| 5.4 | As a user, I can search and filter the app directory | Search by name/description; filter by category (8 categories + "Tất cả") |
| 5.5 | As a user, I see a teaser for upcoming group chat | "Chat nhóm — Sắp ra mắt" banner in sidebar links to teaser page |

### Epic 6: Group Chat (Future)

> *As a user, I can invite friends to a shared chat with AI assistants for collaborative planning.*

| ID | User Story | Acceptance Criteria |
|---|---|---|
| 6.1 | As a user, I can see what group chat will offer | Teaser page shows use cases: trip planning with friends, study groups, team brainstorming |
| 6.2 | As a user, I can express interest in group chat | "Coming soon" page with visual preview of the feature |

---

## 6. Timeline

### Phase 1: Interactive Prototype (Complete)
**Duration:** 2 weeks
**Status:** Done

- 8 mini-app AI assistants with scripted conversations
- Guest mode with daily message limits and login prompt
- V-ID phone + OTP authentication flow
- Rich widget rendering (maps, playlists, restaurants, etc.)
- Chain-of-thought reasoning display
- Settings page with VinClub card
- Sidebar navigation with chat history
- App directory with search and filtering

### Phase 2: Live AI Backend
**Duration:** 6 weeks
**Target:** Q2 2026

- Replace scripted responses with live MCP server connections
- Real-time data for travel (VinPearl API), weather, restaurant availability
- AI model integration for free-form conversation
- Persistent user sessions and chat history (database-backed)
- Production message limits (20/day for guests)

### Phase 3: Transactions & Ecosystem
**Duration:** 8 weeks
**Target:** Q3 2026

- VinClub VPoint spending within AI conversations
- Voucher redemption for bookings and orders
- Payment integration (cards, e-wallets)
- Booking confirmation and order tracking
- Push notifications for deals and reminders

### Phase 4: Social & Expansion
**Duration:** 8 weeks
**Target:** Q4 2026

- Group chat with multi-user AI conversations
- Friend invitations and referral rewards
- Voice input for hands-free interaction
- File/image sharing in conversations
- Web search grounding for AI responses
- VTimes news feed integration
- Mobile native app (iOS & Android)
