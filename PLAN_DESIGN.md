# FRONTEND-DESIGN.md - Keru Frontend

**Project:** Keru — Keep Expenses Recorded & Understood  
**Framework:** Next.js 16.2.2 (App Router)  
**UI:** shadcn/ui + Tailwind CSS v4  
**API:** api.keru.me (NestJS backend)  
**Domains:** keru.me (landing) | app.keru.me (webapp)  
**Date:** April 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Docker Setup](#docker-setup)
4. [Project Structure](#project-structure)
5. [Routing & Middleware](#routing--middleware)
6. [Layouts](#layouts)
7. [Pages](#pages)
8. [Components](#components)
9. [Authentication](#authentication)
10. [API Integration](#api-integration)
11. [State Management](#state-management)
12. [Design System](#design-system)
13. [Implementation Plan](#implementation-plan)

---

## 📊 Overview

### Single Project, Two Domains

One Next.js project serves both domains. Next.js middleware routes requests based on hostname:

```
keru.me           → Landing page, pricing, public marketing pages
app.keru.me       → Login, register, dashboard, expenses, income, tags, profile
api.keru.me       → NestJS backend (separate project)
```

### Design Philosophy

- **Mobile-first** — designed for phones, works on desktop
- **Fast entry** — logging an expense takes under 10 seconds (3 taps: amount → tag → save)
- **Visual clarity** — tag colors provide instant scanning, no reading required
- **Minimal navigation** — 5 tabs: Home, History, +, Tags, Profile
- **No clutter** — show only what the user needs right now

---

## 🔧 Tech Stack

| Tool             | Purpose    | Why                                                              |
| ---------------- | ---------- | ---------------------------------------------------------------- |
| **Next.js 16.2.2** | Framework  | App Router, server components, `proxy.ts` for subdomain routing  |
| **TypeScript**   | Language   | Type safety, matches backend types                               |
| **Tailwind CSS v4** | Styling    | Utility-first, fast iteration, mobile-first breakpoints          |
| **shadcn/ui**    | Components | Copy-paste components, no library dependency, fully customizable |
| **Lucide React** | Icons      | Comes with shadcn, clean icons, tree-shakable                    |
| **Recharts**     | Charts     | Dashboard charts, works well with React/shadcn                   |
| **next-themes**  | Dark mode  | Light/dark theme toggle (optional for MVP)                       |

### What we're NOT using (and why)

- **Redux / Zustand** — overkill for MVP. `useState` + `useContext` is enough
- **React Query / SWR** — nice to have but adds complexity. Plain `fetch` + `useEffect` for MVP. Add React Query later if needed
- **Framer Motion** — no animations in MVP. Ship first, polish later
- **next-auth** — we have our own auth via doorkeeper-nestjs. Custom JWT handling with cookies
- **React Router** — not needed, Next.js App Router handles everything

---

## 🐳 Docker Setup

### Files

The project uses two Dockerfiles: one for development (hot reload) and one for production (optimized build).

```
keru-frontend/
├── Dockerfile          ← Production (multi-stage, optimized)
├── Dockerfile.dev      ← Development (hot reload)
├── docker-compose.yml  ← Local dev with docker compose
├── .dockerignore       ← Keeps images lean
├── .env.local          ← Local environment variables
└── .env.example        ← Reference for env vars
```

### Dockerfile.dev (Development)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Dockerfile (Production)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml (Local Development)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: keru-frontend
    ports:
      - "3001:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    env_file:
      - .env.local
    restart: unless-stopped
```

### Development Commands

```bash
# Start the frontend (with hot reload)
docker compose up

# Start in background
docker compose up -d

# Rebuild after adding new npm packages
docker compose up --build

# View logs
docker compose logs -f

# Stop
docker compose down

# Install a new package (run inside the container)
docker compose exec app npm install <package-name>

# Or rebuild entirely after modifying package.json
docker compose down
docker compose up --build
```

### Local URLs

| Service           | URL                     | Notes                      |
| ----------------- | ----------------------- | -------------------------- |
| Frontend          | `http://localhost:3001` | Next.js dev server         |
| API (your NestJS) | `http://localhost:3000` | Must be running separately |

### Working with the NestJS API locally

Your NestJS backend runs in its own Docker container on port 3000. The frontend connects to it via `NEXT_PUBLIC_API_URL=http://localhost:3000` in `.env.local`.

Make sure both are running:

```bash
# Terminal 1 — API (in your keru-api project)
docker compose up

# Terminal 2 — Frontend (in keru-frontend)
docker compose up
```

### Port Mapping

```
Frontend container :3000 → Host :3001  (to avoid conflict with API on :3000)
API container      :3000 → Host :3000
```

---

## 📁 Project Structure

```
keru-frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout (fonts, metadata, providers)
│   │   │
│   │   ├── (landing)/                    ← keru.me routes
│   │   │   ├── layout.tsx                ← Landing layout (marketing nav, footer)
│   │   │   ├── page.tsx                  ← Home / hero
│   │   │   └── pricing/
│   │   │       └── page.tsx              ← Pricing page
│   │   │
│   │   ├── (auth)/                       ← app.keru.me/login, /register
│   │   │   ├── layout.tsx                ← Auth layout (centered card, no nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   └── (app)/                        ← app.keru.me/* (protected)
│   │       ├── layout.tsx                ← App layout (bottom nav, auth guard)
│   │       ├── dashboard/
│   │       │   └── page.tsx              ← Dashboard / home
│   │       ├── expenses/
│   │       │   ├── page.tsx              ← Expense list / history
│   │       │   ├── new/
│   │       │   │   └── page.tsx          ← Add expense (or modal)
│   │       │   └── [id]/
│   │       │       └── page.tsx          ← Expense detail / edit
│   │       ├── income/
│   │       │   ├── page.tsx              ← Income list
│   │       │   ├── new/
│   │       │   │   └── page.tsx          ← Add income
│   │       │   └── [id]/
│   │       │       └── page.tsx          ← Income detail / edit
│   │       ├── tags/
│   │       │   └── page.tsx              ← Tags overview + management
│   │       └── profile/
│   │           └── page.tsx              ← User profile + settings
│   │
│   ├── components/
│   │   ├── ui/                           ← shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ...
│   │   │
│   │   ├── landing/                      ← Landing page components
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── cta.tsx
│   │   │   ├── landing-nav.tsx
│   │   │   └── landing-footer.tsx
│   │   │
│   │   ├── app/                          ← App-specific components
│   │   │   ├── bottom-nav.tsx            ← Mobile bottom navigation (5 tabs)
│   │   │   ├── balance-card.tsx          ← Monthly balance summary
│   │   │   ├── trends-chart.tsx          ← 6-month bar chart
│   │   │   ├── top-tags.tsx              ← Horizontal scrollable tag cards
│   │   │   ├── recent-transactions.tsx   ← Last 5 transactions list
│   │   │   ├── transaction-item.tsx      ← Single transaction row
│   │   │   ├── expense-form.tsx          ← Add/edit expense form
│   │   │   ├── income-form.tsx           ← Add/edit income form
│   │   │   ├── tag-pill.tsx              ← Colored tag pill (reusable)
│   │   │   ├── tag-selector.tsx          ← Tappable tag selection grid
│   │   │   ├── tag-bar.tsx              ← Tag spending progress bar
│   │   │   ├── date-picker.tsx           ← Date selection (wraps shadcn calendar)
│   │   │   ├── payment-method-select.tsx ← Cash/card/transfer selector
│   │   │   ├── filter-bar.tsx            ← Search + filter controls
│   │   │   └── empty-state.tsx           ← "No expenses yet" placeholder
│   │   │
│   │   └── shared/                       ← Shared across landing + app
│   │       ├── logo.tsx
│   │       └── loading-spinner.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                        ← API client (fetch wrapper with auth headers)
│   │   ├── auth.ts                       ← Token management (store, refresh, logout)
│   │   ├── utils.ts                      ← Utility functions (formatCurrency, formatDate)
│   │   └── constants.ts                  ← API URL, tag colors, payment methods
│   │
│   ├── hooks/
│   │   ├── use-auth.ts                   ← Auth context hook (user, login, logout)
│   │   ├── use-expenses.ts               ← Fetch/create/update/delete expenses
│   │   ├── use-income.ts                 ← Fetch/create/update/delete income
│   │   ├── use-tags.ts                   ← Fetch/create/update/delete tags
│   │   └── use-dashboard.ts              ← Fetch dashboard data
│   │
│   ├── context/
│   │   └── auth-context.tsx              ← Auth provider (wraps app with user state)
│   │
│   ├── types/
│   │   ├── auth.ts                       ← LoginResponse, RegisterRequest, User
│   │   ├── expense.ts                    ← Expense, CreateExpenseDto
│   │   ├── income.ts                     ← Income, CreateIncomeDto
│   │   ├── tag.ts                        ← Tag, CreateTagDto
│   │   ├── dashboard.ts                  ← Summary, TagBreakdown, Trend
│   │   └── api.ts                        ← PaginatedResponse, ApiError
│   │
│   └── proxy.ts                          ← Subdomain routing (keru.me vs app.keru.me) [Next.js 16]
│
├── .env.local                            ← NEXT_PUBLIC_API_URL=https://api.keru.me
├── .env.example
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
└── README.md
```

---

## 🔀 Routing & Proxy

### Proxy — Subdomain Routing (Next.js 16)

> **Note:** Next.js 16 deprecated `middleware.ts`. Subdomain routing now lives in `src/proxy.ts` with a named `export function proxy()`.

```typescript
// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const APP_ROUTES = ["/dashboard", "/expenses", "/income", "/tags", "/profile", "/login", "/register"];

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;

  // Localhost — skip all subdomain logic
  const isLocal = hostname.startsWith("localhost") || hostname.startsWith("127.");
  if (isLocal) return NextResponse.next();

  // keru.me → redirect app routes to app.keru.me
  if (!hostname.startsWith("app.")) {
    if (APP_ROUTES.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL(path, `https://app.keru.me`));
    }
  }

  // app.keru.me → root redirects to /dashboard; /pricing redirects to keru.me
  if (hostname.startsWith("app.")) {
    if (path === "/") return NextResponse.redirect(new URL("/dashboard", request.url));
    if (path.startsWith("/pricing")) return NextResponse.redirect(new URL(path, `https://keru.me`));
  }

  return NextResponse.next();
}
```

### Route Map

| URL                         | Route Group | Page            | Auth      |
| --------------------------- | ----------- | --------------- | --------- |
| `keru.me`                   | (landing)   | Landing hero    | Public    |
| `keru.me/pricing`           | (landing)   | Pricing page    | Public    |
| `app.keru.me/login`         | (auth)      | Login form      | Public    |
| `app.keru.me/register`      | (auth)      | Register form   | Public    |
| `app.keru.me/dashboard`     | (app)       | Dashboard home  | Protected |
| `app.keru.me/expenses`      | (app)       | Expense history | Protected |
| `app.keru.me/expenses/new`  | (app)       | Add expense     | Protected |
| `app.keru.me/expenses/[id]` | (app)       | Edit expense    | Protected |
| `app.keru.me/income`        | (app)       | Income history  | Protected |
| `app.keru.me/income/new`    | (app)       | Add income      | Protected |
| `app.keru.me/tags`          | (app)       | Tags management | Protected |
| `app.keru.me/profile`       | (app)       | User profile    | Protected |

---

## 🖼️ Layouts

### Root Layout (`app/layout.tsx`)

Wraps everything. Sets fonts, metadata, and global providers.

```
<html>
  <body>
    <AuthProvider>
      {children}
    </AuthProvider>
  </body>
</html>
```

### Landing Layout (`app/(landing)/layout.tsx`)

```
┌─────────────────────────────────┐
│  Logo          Pricing  Login →  │  ← Marketing nav
├─────────────────────────────────┤
│                                   │
│         {children}                │  ← Page content
│                                   │
├─────────────────────────────────┤
│  Footer (links, social, etc.)   │  ← Footer
└─────────────────────────────────┘
```

### Auth Layout (`app/(auth)/layout.tsx`)

```
┌─────────────────────────────────┐
│                                   │
│          ┌───────────┐           │
│          │   Logo    │           │  ← Centered card
│          │   Form    │           │
│          │   Button  │           │
│          └───────────┘           │
│                                   │
└─────────────────────────────────┘
```

### App Layout (`app/(app)/layout.tsx`)

```
┌─────────────────────────────────┐
│                                   │
│         {children}                │  ← Scrollable content
│                                   │
│                                   │
├─────────────────────────────────┤
│  Home  History  [+]  Tags  Profile│  ← Bottom nav (fixed)
└─────────────────────────────────┘
```

The app layout includes:

- Auth guard — redirects to `/login` if no valid token
- Bottom navigation — always visible, blue "+" button centered
- No top navigation bar — maximizes content space on mobile

---

## 📄 Pages

### Login (`/login`)

```
┌─────────────────────┐
│                       │
│       Keru logo       │
│                       │
│  ┌─────────────────┐ │
│  │  Email           │ │
│  └─────────────────┘ │
│  ┌─────────────────┐ │
│  │  Password        │ │
│  └─────────────────┘ │
│                       │
│  [    Login    ]      │
│                       │
│  Don't have account?  │
│  Register →           │
│                       │
└─────────────────────┘
```

- Email + password fields
- Login button (disabled while loading)
- Link to register
- Error message display (invalid credentials, etc.)
- On success: store tokens, redirect to `/dashboard`

### Register (`/register`)

```
┌─────────────────────┐
│                       │
│       Keru logo       │
│                       │
│  ┌─────────────────┐ │
│  │  Name            │ │
│  └─────────────────┘ │
│  ┌─────────────────┐ │
│  │  Email           │ │
│  └─────────────────┘ │
│  ┌─────────────────┐ │
│  │  Password        │ │
│  └─────────────────┘ │
│                       │
│  [   Register   ]     │
│                       │
│  Already have account?│
│  Login →              │
│                       │
└─────────────────────┘
```

- Name, email, password fields
- On success: tokens stored, starter tags seeded by API, redirect to `/dashboard`

### Dashboard (`/dashboard`)

The main screen. Shows financial pulse at a glance.

```
┌──────────────────────────┐
│  Good morning, Luis   🔔 │
│                            │
│  APRIL 2026                │
│  $1,247.50  balance        │
│  ↑ $2,500   ↓ $1,252.50   │
│                            │
│  ┌──────────────────────┐ │
│  │ ▁ ▃ ▂ ▅ ▃ ▂          │ │  ← 6-month spending trend
│  │ N  D  J  F  M  Apr   │ │
│  └──────────────────────┘ │
│                            │
│  Top tags          See all │
│  ┌─────┐┌─────┐┌────────┐│
│  │food ││trans││subscrip││  ← Horizontal scroll
│  │$420 ││$285 ││$180    ││
│  └─────┘└─────┘└────────┘│
│                            │
│  Recent              See all│
│  🔴 Pollo Campero   -$8.50│
│  🟡 Uber to work    -$3.25│
│  🟢 Monthly salary +$2,500│
│                            │
├────────────────────────────┤
│ Home History [+] Tags Prof │
└────────────────────────────┘
```

**Components used:** `balance-card`, `trends-chart`, `top-tags`, `recent-transactions`, `transaction-item`

**API calls:**

- `GET /dashboard/summary?month=2026-04`
- `GET /dashboard/by-tags?month=2026-04`
- `GET /dashboard/trends?months=6`
- `GET /expenses?limit=5&sort=date:desc`

### Add Expense (`/expenses/new`)

Fast entry form — the most critical screen.

```
┌──────────────────────────┐
│  ✕    New expense         │
│                            │
│         Amount             │
│       $ 8.50               │  ← Big, centered, auto-focus
│                            │
│  Description               │
│  ┌────────────────────┐   │
│  │ Pollo Campero      │   │
│  └────────────────────┘   │
│                            │
│  Tags                      │
│  (food) transport housing  │  ← Tappable pills
│  subscriptions health      │
│  entertainment             │
│                            │
│  Date          Payment     │
│  ┌────────┐  ┌────────┐   │
│  │ Today  │  │ Cash   │   │
│  └────────┘  └────────┘   │
│                            │
│  [     Save expense     ]  │
│                            │
└──────────────────────────┘
```

**UX decisions:**

- Amount field auto-focuses on open — user starts typing immediately
- Tags show recently used first, then alphabetical
- Date defaults to today, payment defaults to last used method
- Description is optional — many people just do amount + tag
- Can also be opened as a bottom sheet/modal from the "+" button instead of a full page

**API call:** `POST /expenses`

### Expense History (`/expenses`)

```
┌──────────────────────────┐
│  History                   │
│  ┌──────────────┐ ┌────┐ │
│  │ 🔍 Search... │ │ ⫧  │ │  ← Filter button
│  └──────────────┘ └────┘ │
│                            │
│  (All) Expenses Income     │  ← Tab filter
│                            │
│  TODAY, APR 4              │
│  🔴 Pollo Campero   -$8.50│
│     food · cash            │
│  🟡 Uber to work    -$3.25│
│     transport · debit card │
│  🟢 Freelance      +$350  │
│     freelance · transfer   │
│                            │
│  YESTERDAY, APR 3          │
│  🔵 Netflix         -$6.99│
│     subscriptions · enter..│
│  🔴 Super Selectos -$42.30│
│     food · debit card      │
│                            │
├────────────────────────────┤
│ Home History [+] Tags Prof │
└────────────────────────────┘
```

**Features:**

- Grouped by date
- Each item shows: tag color dot, description, amount, tag pills, payment method
- Tap item → opens detail/edit view
- Swipe left to delete (future)
- Filter panel: date range, tags, payment method, amount range
- Infinite scroll or pagination

**API call:** `GET /expenses?page=1&limit=20&sort=date:desc`

### Tags (`/tags`)

```
┌──────────────────────────┐
│  Tags          [+ New tag] │
│                            │
│  THIS MONTH'S SPENDING     │
│  🔴 food         $420  ███│
│  🟡 transport    $285  ██ │
│  🔵 subscriptions $180 █  │
│  🟣 housing      $150  █  │
│  🟢 health        $95  ▌  │
│  🩷 entertainment  $72  ▌  │
│                            │
│  ALL TAGS                  │
│  ┌────┐┌─────────┐┌─────┐│
│  │food││transport ││hous.││
│  └────┘└─────────┘└─────┘│
│  ┌────────┐┌──────┐┌────┐│
│  │subscrip││health││ent.││
│  └────────┘└──────┘└────┘│
│  ┌──────┐┌────────┐┌────┐│
│  │salary││freelanc││edu ││
│  └──────┘└────────┘└────┘│
│                            │
│  Tap a tag to edit         │
│                            │
├────────────────────────────┤
│ Home History [+] Tags Prof │
└────────────────────────────┘
```

**API calls:**

- `GET /tags`
- `GET /dashboard/by-tags?month=2026-04`

### Profile (`/profile`)

```
┌──────────────────────────┐
│  Profile                   │
│                            │
│       ┌────┐               │
│       │ LG │               │  ← Initials avatar
│       └────┘               │
│     Luis Germa             │
│   luis@example.com         │
│                            │
│  ─────────────────────     │
│  Name              Luis  > │
│  Email     luis@exam...  > │
│  ─────────────────────     │
│  Export data (CSV)       > │
│  ─────────────────────     │
│  Active sessions         > │
│  ─────────────────────     │
│  Logout                    │
│                            │
├────────────────────────────┤
│ Home History [+] Tags Prof │
└────────────────────────────┘
```

**API calls:**

- `GET /users/me`
- `PATCH /users/me`
- `GET /auth/sessions`
- `POST /auth/logout`

---

## 🧩 Components

### Core App Components

| Component               | Description                                            | Used in             |
| ----------------------- | ------------------------------------------------------ | ------------------- |
| `bottom-nav`            | 5-tab navigation with floating "+" button              | App layout          |
| `balance-card`          | Monthly balance with income/expense arrows             | Dashboard           |
| `trends-chart`          | 6-month bar chart (Recharts)                           | Dashboard           |
| `top-tags`              | Horizontal scrollable tag spending cards               | Dashboard           |
| `recent-transactions`   | Last N transactions list                               | Dashboard           |
| `transaction-item`      | Single transaction row (color dot, desc, tags, amount) | History, Dashboard  |
| `expense-form`          | Amount, description, tags, date, payment method        | Add/Edit expense    |
| `income-form`           | Amount, description, tags, date, type                  | Add/Edit income     |
| `tag-pill`              | Colored tag badge                                      | Everywhere          |
| `tag-selector`          | Grid of tappable tag pills for selection               | Expense/Income form |
| `tag-bar`               | Tag name + spending amount + progress bar              | Tags page           |
| `date-picker`           | Date selector wrapping shadcn calendar                 | Forms               |
| `payment-method-select` | Cash / Debit / Credit / Transfer selector              | Expense form        |
| `filter-bar`            | Search input + filter button                           | History             |
| `empty-state`           | Illustration + message for empty lists                 | All list pages      |

### shadcn/ui Components to Install

```bash
npx shadcn@latest add button input card badge dialog select
npx shadcn@latest add calendar popover separator avatar
npx shadcn@latest add dropdown-menu sheet tabs toast
```

---

## 🔐 Authentication

### Token Flow

```
Login/Register
  → API returns { access_token, refresh_token, expires_in }
  → Store access_token in memory (variable)
  → Store refresh_token in httpOnly cookie (or localStorage for MVP)

Every API request
  → Attach Authorization: Bearer <access_token>
  → If 401 response → try refresh
    → POST /auth/refresh { refresh_token }
    → If success → update tokens, retry original request
    → If fail → redirect to /login

Logout
  → POST /auth/logout
  → Clear tokens
  → Redirect to /login
```

### Auth Context

```typescript
// context/auth-context.tsx provides:
{
  user: User | null,
  isLoading: boolean,
  login: (email, password) => Promise<void>,
  register: (name, email, password) => Promise<void>,
  logout: () => Promise<void>,
  isAuthenticated: boolean,
}
```

### Auth Guard

The `(app)/layout.tsx` checks authentication status. If not authenticated, redirect to `/login`. This runs on every protected page load.

---

## 🌐 API Integration

### API Client

A single `lib/api.ts` file handles all HTTP communication:

```typescript
// lib/api.ts provides:
api.get<T>(path, params?)     // GET with query params
api.post<T>(path, body)       // POST with JSON body
api.patch<T>(path, body)      // PATCH with JSON body
api.delete(path)              // DELETE

// Automatically:
// - Prepends NEXT_PUBLIC_API_URL
// - Attaches Authorization header
// - Handles 401 → refresh token → retry
// - Throws typed ApiError on failure
```

### API Endpoints Used

| Hook            | Endpoints                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `use-auth`      | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout`                       |
| `use-expenses`  | `GET /expenses`, `GET /expenses/:id`, `POST /expenses`, `PATCH /expenses/:id`, `DELETE /expenses/:id`      |
| `use-income`    | `GET /income`, `GET /income/:id`, `POST /income`, `PATCH /income/:id`, `DELETE /income/:id`                |
| `use-tags`      | `GET /tags`, `POST /tags`, `PATCH /tags/:id`, `DELETE /tags/:id`                                           |
| `use-dashboard` | `GET /dashboard/summary`, `GET /dashboard/by-tags`, `GET /dashboard/compare-tags`, `GET /dashboard/trends` |

---

## 📦 State Management

### MVP Approach — Keep It Simple

```
Auth state       → React Context (AuthProvider)
Server data      → fetch in useEffect + useState per page
Form state       → useState in form components
UI state         → useState (modals open/close, active tab, etc.)
```

No global state library. Each page fetches its own data. Shared data (user info, tags list) comes from context or is fetched where needed.

### Future Upgrade Path

When the app grows and re-fetching becomes a problem:

```
Auth state       → React Context (keep)
Server data      → React Query (add caching, background refresh)
Form state       → React Hook Form (add validation)
```

---

## 🎨 Design System

### Colors

**Brand color:** Blue `#3B82F6` (used for primary buttons, "+" FAB, active nav)

**Tag colors** (from DESIGN.md):

| Tag           | Color     | Background |
| ------------- | --------- | ---------- |
| food          | `#EF4444` | `#FEF2F2`  |
| transport     | `#F59E0B` | `#FFF7ED`  |
| housing       | `#8B5CF6` | `#F5F3FF`  |
| subscriptions | `#3B82F6` | `#EFF6FF`  |
| health        | `#10B981` | `#ECFDF5`  |
| entertainment | `#EC4899` | `#FDF2F8`  |
| education     | `#6366F1` | `#EEF2FF`  |
| salary        | `#22C55E` | `#F0FDF4`  |
| freelance     | `#14B8A6` | `#F0FDFA`  |

**Semantic colors:**

- Income: `#22C55E` (green)
- Expense: default text color (neutral, not red — red feels punishing)
- Balance positive: `#22C55E`
- Balance negative: `#EF4444`

### Typography

- **Headings:** `text-lg font-medium` (18px)
- **Body:** `text-sm` (14px) for most app content
- **Labels:** `text-xs text-muted-foreground` (12px)
- **Large numbers:** `text-3xl font-medium` (30px) for balance, amounts

### Spacing

- Page padding: `px-5` (20px)
- Between sections: `mb-5` (20px)
- Between items in a list: `py-3` (12px) with border separator
- Card padding: `p-4` (16px)

### Responsive Design Strategy

Keru is mobile-first but must feel native at every viewport — not just a stretched phone.

#### Breakpoints

| Name    | Tailwind | Width     | Target device            |
| ------- | -------- | --------- | ------------------------ |
| Mobile  | default  | < 640px   | Phone (375–428px)        |
| Tablet  | `md:`    | 640–1023px | iPad, large phones       |
| Desktop | `lg:`    | ≥ 1024px  | Laptop / external screen |

---

#### Mobile (default — < 640px)

The primary experience. Everything is already built for this.

- **Layout:** single column, full width
- **Navigation:** fixed bottom bar (4 tabs + FAB center)
- **Content width:** full width with `px-5` side padding
- **Forms:** full-width inputs, stacked fields
- **Charts:** full-width bar chart, horizontal scroll for month picker
- **Dialogs/sheets:** slide up from bottom, `rounded-t-2xl`

---

#### Tablet (md: 640px–1023px)

Same single-column layout but with more breathing room. No structural changes needed — just spacing and width adjustments.

- **Layout:** centered column, `max-w-lg mx-auto` (up from `max-w-md`)
- **Navigation:** bottom bar stays — still feels natural on iPad in portrait
- **Content:** slightly larger type scale (`md:text-base` for body, `md:text-4xl` for balance)
- **Cards:** wider cards, `md:p-6` padding
- **Dialogs:** centered modal style instead of bottom sheet (`md:rounded-2xl md:items-center`)
- **Dashboard:** balance card + chart side-by-side in a 2-column grid (`md:grid md:grid-cols-2`)
- **Transaction list:** wider rows, amount column right-aligned with more space

---

#### Desktop (lg: ≥ 1024px)

True two-panel layout. The bottom nav moves to a left sidebar.

**Shell layout:**
```
┌──────────────────────────────────────────┐
│  ┌──────────┐  ┌───────────────────────┐ │
│  │          │  │                       │ │
│  │  Sidebar │  │    Main content       │ │
│  │  nav     │  │    max-w-2xl          │ │
│  │  240px   │  │                       │ │
│  │          │  │                       │ │
│  └──────────┘  └───────────────────────┘ │
└──────────────────────────────────────────┘
```

- **Sidebar:** fixed left, 240px wide — logo at top, nav items with icon + label, user avatar + name at bottom
- **Main content:** `ml-60 max-w-2xl` — grows with the viewport, capped at 2xl
- **Bottom nav:** hidden (`lg:hidden`)
- **FAB:** replaced by a persistent "New transaction" button in the sidebar
- **Dashboard:** 3-column card grid (Balance | This month expenses | This month income), chart full-width below
- **History page:** filters in a sticky left-aligned column, list in the main area (2-panel within main)
- **Forms (new expense/income):** centered card `max-w-md mx-auto` within the main area — no need to go full-width
- **Dialogs:** always centered modal, never bottom sheet

**Sidebar nav items:**
```
[Keru logo]

🏠  Dashboard
📋  History
🏷️  Tags
👤  Profile

───────────
[Avatar] Luis
         [+ New]
```

---

#### Landing page (keru.me)

Separate from the app shell. Fully responsive standalone pages.

| Viewport | Header | Hero | Features | CTA |
|----------|--------|------|----------|-----|
| Mobile   | Hamburger menu | Stacked text + mockup | Single column cards | Full-width button |
| Tablet   | Horizontal nav links | 2-column (text left, image right) | 2-column grid | Centered button |
| Desktop  | Full nav + CTA button | Large 2-column, oversized headline | 3-column feature grid | Large pill CTA |

Hero headline scales:
- Mobile: `text-4xl` (36px), weight 800
- Tablet: `text-5xl` (48px)
- Desktop: `text-7xl` (72px), weight 900, `leading-[0.9]` — Wise-inspired billboard feel

---

#### Implementation approach

1. **Now (MVP app):** mobile layout is complete. Tablet is largely free — just add `max-w-lg` and a few `md:` spacing overrides in the shell layout.
2. **After landing page:** add desktop sidebar as a layout variant inside `(app)/layout.tsx` using `lg:flex lg:flex-row`.
3. **Landing page (Phase 9):** build desktop-first for the hero, add mobile collapse with `md:` prefixes.

---

## 🛠️ Implementation Plan

### Phase 1: Project Setup ✅

- [x] Initialize Next.js 16.2.2 with App Router and TypeScript
- [x] Install and configure Tailwind CSS v4
- [x] Install shadcn/ui and required components
- [x] Create project structure (folders, route groups)
- [x] Setup environment variables (`.env.local`)
- [x] Create `proxy.ts` for subdomain routing (Next.js 16 — replaces `middleware.ts`)
- [x] Create root layout with fonts and metadata
- [x] Create Dockerfile

### Phase 2: Auth Pages ✅

- [x] Create auth layout (centered card)
- [x] Build login page with form
- [x] Build register page with form
- [x] Create `lib/api.ts` (API client with auth headers + 401→refresh→retry with concurrent request queue)
- [x] Create `lib/auth.ts` (access token in-memory + sessionStorage; refresh token in localStorage)
- [x] Create `context/auth-context.tsx` (AuthProvider)
- [x] Create `hooks/use-auth.ts`

### Phase 3: App Layout & Navigation ✅

- [x] Create app layout with auth guard
- [x] Build `bottom-nav` component (5 tabs + floating "+" FAB)
- [x] Create `types/` files (expense, income, tag, dashboard, auth, api)
- [x] Create `lib/constants.ts` (API_URL, TAG_COLORS, PAYMENT_METHODS)
- [x] Extend `lib/utils.ts` (formatCurrency, formatDate, formatMonth, currentMonth)
- [x] Setup redirect: root `/` → `/dashboard` (local dev via `src/app/page.tsx`)

### Phase 4: Dashboard ✅

- [x] Create `hooks/use-dashboard.ts` (4 parallel fetches, tick-based refetch, cancelled flag)
- [x] Build `tag-pill` component (colored badge, sm/md sizes)
- [x] Build `balance-card` component
- [x] Build `trends-chart` component (Recharts BarChart, income+expenses, 6 months)
- [x] Build `top-tags` component (horizontal scroll)
- [x] Build `transaction-item` + `recent-transactions` components
- [x] Assemble dashboard page with greeting, loading/error states

### Phase 5: Expenses ✅

- [x] Create `hooks/use-expenses.ts`
- [x] Build `tag-selector` component
- [x] Build `payment-method-select` component
- [x] Build add expense page (`/expenses/new`)
- [x] Build expense history page (`/expenses`) with month filter + tag filter
- [x] Build expense detail/edit page (`/expenses/[id]`)
- [x] Build `empty-state` component

### Phase 6: Income ✅

- [x] Create `hooks/use-income.ts`
- [x] Build add income page (`/income/new`)
- [x] Build income detail/edit page (`/income/[id]`)
- [x] Unified History page (`/expenses`) with Expenses / Income tabs
- [x] FAB expands to Expense / Income choice

### Phase 7: Tags ✅

- [x] Create `hooks/use-tags.ts`
- [x] Build tags page with tag list, create/edit dialog, delete confirmation
- [x] Tag color picker (10 preset swatches) + live pill preview
- [x] Clickable top-tags on dashboard → filter History by tag (`?tag=`)
- [x] Dismissable tag filter pill on History page

### Phase 8: Profile ✅

- [x] Build profile page
- [x] Edit name / lastname / bio via `PATCH /v1/users/me` + `refreshUser()`
- [x] Logout functionality

### Phase 9: Landing Page

- [ ] Create landing layout (nav + footer)
- [ ] Build hero section
- [ ] Build features section (with mockup screenshots)
- [ ] Build CTA section
- [ ] Build pricing page (if applicable)

### Phase 10: Polish

- [ ] Loading states on all pages
- [ ] Error handling and toast notifications
- [ ] Empty states for all lists
- [ ] Form validation messages
- [ ] Mobile responsiveness check
- [ ] Basic desktop layout (centered max-w-md)
- [ ] Favicon and metadata

---

## 📝 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000    # Development
# NEXT_PUBLIC_API_URL=https://api.keru.me   # Production

NEXT_PUBLIC_APP_URL=http://localhost:3001    # Development
# NEXT_PUBLIC_APP_URL=https://app.keru.me   # Production
```

---

---

## ✅ Checklist

### Setup

- [x] Next.js 16.2.2 initialized
- [x] shadcn/ui installed
- [x] Tailwind CSS v4 configured
- [x] Docker setup (Dockerfile, Dockerfile.dev, docker-compose.yml)
- [x] `proxy.ts` subdomain routing (Next.js 16)
- [x] API client (`lib/api.ts`) with 401→refresh→retry
- [x] Auth context working

### Pages

- [x] Login
- [x] Register
- [x] Dashboard
- [ ] Add expense
- [ ] Expense history
- [ ] Add income
- [ ] Income history
- [ ] Tags
- [ ] Profile
- [ ] Landing page

### Components

- [x] Bottom nav
- [x] Balance card
- [x] Trends chart
- [x] Tag pill
- [ ] Tag selector
- [x] Transaction item
- [ ] Expense form
- [ ] Income form
- [ ] Filter bar
- [ ] Empty state

---

**END OF FRONTEND DESIGN DOCUMENT**

Last updated: April 5, 2026  
Version: 1.0  
Author: Luis (with Claude assistance)
