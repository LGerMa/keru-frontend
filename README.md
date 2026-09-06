# Keru — Keep Expenses Recorded & Understood

A mobile-first personal finance tracker that helps you stay on top of where your
money goes — without the complexity of traditional budgeting apps.

Track income and expenses, organize by tags, set budgets, watch recurring
charges, and get a clear picture of your finances at a glance.

This repo is the **frontend** (Next.js). The API is a separate NestJS project.

---

## Table of contents

- [What the app does](#what-the-app-does)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [How it fits together](#how-it-fits-together)
  - [Routing and the two domains](#routing-and-the-two-domains)
  - [Authentication](#authentication)
  - [Talking to the API](#talking-to-the-api)
  - [Data fetching (hooks)](#data-fetching-hooks)
  - [Selected month](#selected-month)
  - [UI components](#ui-components)
- [Conventions](#conventions)
- [⚠️ This is not the Next.js you know](#-this-is-not-the-nextjs-you-know)
- [Design system](#design-system)
- [Where to start reading](#where-to-start-reading)

---

## What the app does

| Area | Route | Notes |
|---|---|---|
| **Dashboard** | `/dashboard` | Balance hero, quick stats, category donut, recent transactions, recurring watchlist, trends chart |
| **Expenses** | `/expenses`, `/expenses/new`, `/expenses/[id]` | Log, filter by month/tag, browse, edit, delete |
| **Income** | `/income`, `/income/new`, `/income/[id]` | Same shape as expenses, plus income type |
| **Tags** | `/tags` | Custom spending categories with color labels; budgets live here too |
| **Recurring** | `/recurring` | Recurring income/expenses with a frequency; pause/resume |
| **Profile** | `/profile` | Account details |
| **Auth** | `/login`, `/register` | Outside the app shell |

A guiding constraint from the design docs: **logging an expense takes under 10
seconds** (amount → tag → save).

---

## Tech stack

- **Framework:** Next.js 16.2.2 — App Router, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components (copied into `src/components/ui/`, not a dependency)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Dates:** date-fns + a few `Intl` helpers in `src/lib/utils.ts`
- **Toasts:** Sonner
- **Backend:** NestJS at `api.keru.me` (separate repo)
- **Domains:** `keru.me` (landing) · `app.keru.me` (webapp) · `api.keru.me` (API)

There is **no global state library**. State is React `useState` + two small
Contexts (auth, selected month). Server data is fetched per-screen with custom
hooks.

---

## Getting started

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

Or with Docker (hot reload, uses `Dockerfile.develop`):

```bash
docker compose up
```

The Docker app is exposed on **http://localhost:3001** (`3001:3000` in
`docker-compose.yml`, reading env from `.env.local`).

Scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |

---

## Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5005   # NestJS backend; "/api" is appended in src/lib/constants.ts
NEXT_PUBLIC_APP_URL=http://localhost:3001   # this app's own URL (used for cross-domain redirects)
```

Both are read in [`src/lib/constants.ts`](src/lib/constants.ts). `API_URL`
resolves to `${NEXT_PUBLIC_API_URL}/api`; endpoints in the hooks then add their
own version prefix (e.g. `/v1/expenses`).

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout — <html>, Inter font, <AuthProvider>
│   ├── page.tsx              # "/" → redirect to /dashboard
│   ├── globals.css           # Tailwind v4 setup + design tokens (see DESIGN.md)
│   ├── (app)/                # Authenticated app — shares the sidebar/bottom-nav shell
│   │   ├── layout.tsx        # Auth guard, sidebar, mobile bottom nav + FAB, month picker, dark toggle
│   │   ├── dashboard/
│   │   ├── expenses/         # list · new · [id]
│   │   ├── income/           # list · new · [id]
│   │   ├── tags/
│   │   ├── recurring/
│   │   └── profile/
│   └── (auth)/               # Login / register — minimal centered layout
│       ├── layout.tsx
│       ├── login/
│       └── register/
├── proxy.ts                  # Hostname-based routing (this version's "middleware" — see below)
├── components/
│   ├── ui/                   # shadcn primitives — button, card, dialog, select, sheet, tabs, …
│   └── app/                  # Keru-specific — balance-card, category-donut, transaction-item, …
├── context/
│   ├── auth-context.tsx      # AuthProvider + useAuthContext (login/register/logout/refreshUser)
│   └── month-context.tsx     # MonthProvider + useSelectedMonth  ("YYYY-MM")
├── hooks/
│   ├── use-auth.ts           # re-export of useAuthContext
│   ├── use-dashboard.ts      # dashboard summary + tag breakdown + trends + recent
│   ├── use-expenses.ts       # list/create/update/delete/get expenses
│   ├── use-income.ts         # same for income
│   ├── use-tags.ts           # tags CRUD
│   ├── use-budgets.ts        # budgets + budget status
│   ├── use-recurring.ts      # recurring entries + pause/resume
│   ├── use-insights.ts       # tag comparison across months
│   └── use-balance-delta.ts  # balance change vs. previous period
├── lib/
│   ├── api.ts                # fetch wrapper: auth header, token refresh + retry, error type
│   ├── auth.ts               # token storage (access = in-memory/sessionStorage, refresh = localStorage)
│   ├── constants.ts          # API_URL, APP_URL, TAG_COLORS, PAYMENT_METHODS
│   └── utils.ts              # cn(), formatCurrency(), formatDate(), formatMonth(), currentMonth()
└── types/                    # one file per domain: api, auth, expense, income, tag, budget, recurring, dashboard
```

---

## How it fits together

### Routing and the two domains

One Next.js project serves `keru.me` and `app.keru.me`.
[`src/proxy.ts`](src/proxy.ts) inspects the request `host` header:

- **Locally** (localhost, 127.x, ngrok tunnels) it does nothing — every route
  just works.
- On `keru.me`, requests for app routes (`/dashboard`, `/expenses`, …) redirect
  to `app.keru.me`.
- On `app.keru.me`, `/` redirects to `/dashboard`, and `/pricing` redirects back
  to `keru.me`.

### Authentication

- [`AuthProvider`](src/context/auth-context.tsx) wraps the whole app in the root
  layout. It exposes `user`, `isAuthenticated`, `isLoading`, and
  `login / register / logout / refreshUser`.
- The **auth guard** is in [`src/app/(app)/layout.tsx`](src/app/(app)/layout.tsx):
  once auth finishes loading, an unauthenticated user is redirected to `/login`.
  Pages under `(auth)` are not guarded.
- Tokens ([`src/lib/auth.ts`](src/lib/auth.ts)): the **access token** lives in
  memory (falling back to `sessionStorage`); the **refresh token** lives in
  `localStorage` so sessions survive tab reloads.

### Talking to the API

Everything goes through [`src/lib/api.ts`](src/lib/api.ts) — a small `fetch`
wrapper with `api.get / post / patch / delete`. It:

- adds `Authorization: Bearer <accessToken>` when a token is present,
- on a `401`, transparently calls `/auth/refresh`, retries the request once, and
  queues concurrent requests during the refresh,
- unwraps `{ data: … }` responses,
- throws a typed `ApiClientError` (`statusCode`, `error`, `message`).

### Data fetching (hooks)

There's no data cache. Each screen calls a hook in `src/hooks/`; the hook owns
its `isLoading` / `error` / `data` state and a `refetch`. Mutations return the
API result and the caller re-fetches. Endpoints are versioned (`/v1/...`).

### Selected month

Most screens are scoped to a month. [`MonthProvider`](src/context/month-context.tsx)
holds it as a `"YYYY-MM"` string (default: current month). The topbar month
chip in the `(app)` layout sets it; hooks like `useDashboard(month)` and
`useExpenses({ month })` read it.

### UI components

- `src/components/ui/` — shadcn primitives, copied in and customized. Style is
  merged with `cn()` (`clsx` + `tailwind-merge`) — the most-used function in the
  codebase.
- `src/components/app/` — Keru-specific building blocks (balance card, category
  donut, transaction item, tag pill, recurring watchlist, …).

---

## Conventions

- **Path alias:** `@/` → `src/` (see `tsconfig.json`).
- **Client vs. server:** anything using hooks, context, or browser APIs starts
  with `"use client"`. The `(app)` layout and most pages are client components.
- **Money:** always render through `formatCurrency()`. Income is the green
  `#22C55E`; expenses use the foreground color.
- **Dates:** date-only strings (`"YYYY-MM-DD"`) are parsed as *local* calendar
  dates in `utils.ts` on purpose — don't `new Date("2026-04-01")` directly
  (it's UTC and shifts a day in western timezones).
- **Tag colors:** `TAG_COLORS` in `constants.ts`; badges use a ~10% tint of the
  tag color as background.

---

## ⚠️ This is not the Next.js you know

See [AGENTS.md](AGENTS.md). This project runs a Next.js version with breaking
changes from what you may expect. The one that trips people up first:

**There is no `middleware.ts`.** Hostname/redirect logic lives in
[`src/proxy.ts`](src/proxy.ts), exporting `proxy(request)` and a `config.matcher`.
This is the current Next.js convention in this version — see
`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.

Before writing framework-level code, check the bundled docs in
`node_modules/next/dist/docs/` rather than relying on memory.

---

## Design system

The full visual language — colors, typography, spacing, radius, shadows, and
component patterns — is in [DESIGN.md](DESIGN.md). Highlights:

- Fresh **indigo** theme, mobile-first, defined as CSS custom properties in
  `src/app/globals.css`.
- Dark mode via a `.dark` class on `<html>` (toggled in the `(app)` layout,
  persisted to `localStorage` as `keruDark`).
- Design history and rationale: [PLAN_DESIGN.md](PLAN_DESIGN.md) and
  `docs/superpowers/` (redesign spec + plan).

---

## Where to start reading

If you're new, read these files in order:

1. [`src/proxy.ts`](src/proxy.ts) — how a request is routed.
2. [`src/app/layout.tsx`](src/app/layout.tsx) → [`src/context/auth-context.tsx`](src/context/auth-context.tsx) — how auth is established.
3. [`src/app/(app)/layout.tsx`](src/app/(app)/layout.tsx) — the app shell, auth guard, nav, month picker.
4. [`src/lib/api.ts`](src/lib/api.ts) — how every request reaches the backend.
5. [`src/hooks/use-dashboard.ts`](src/hooks/use-dashboard.ts) + [`src/app/(app)/dashboard/page.tsx`](src/app/(app)/dashboard/page.tsx) — a full screen, end to end.
6. [DESIGN.md](DESIGN.md) — so your UI matches everything else.
