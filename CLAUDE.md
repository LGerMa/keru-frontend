# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Keru** — Keep Expenses Recorded & Understood. A mobile-first personal finance tracker.

- **Backend:** NestJS at `api.keru.me` (separate repo)
- **Domains:** `keru.me` (landing) | `app.keru.me` (webapp) — both served from this single Next.js project
- `NEXT_PUBLIC_API_URL` — backend base URL; `NEXT_PUBLIC_APP_URL` — webapp URL

## Commands

```bash
npm run dev       # Start dev server (Turbopack by default)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (next build no longer auto-lints in v16)
```

```bash
docker compose up           # Dev with hot reload (frontend on :3001)
docker compose up --build   # Rebuild after adding packages
docker compose exec app npm install <pkg>  # Install package inside container
```

No test framework is configured yet.

## Architecture

**Next.js 16.2.2**, App Router, TypeScript. Path alias `@/*` → `src/*`.

**UI stack:** Tailwind CSS v4, shadcn/ui (radix-ui + class-variance-authority + clsx + tailwind-merge), lucide-react, sonner (toasts), recharts (charts), react-day-picker, next-themes.

### Route groups and subdomain routing

`src/middleware.ts` inspects the `host` header and rewrites/redirects between route groups:

| Domain | Route group | Routes |
|--------|-------------|--------|
| `keru.me` | `(landing)` | `/`, `/pricing` |
| `app.keru.me` | `(auth)` | `/login`, `/register` |
| `app.keru.me` | `(app)` | `/dashboard`, `/expenses`, `/income`, `/tags`, `/profile` |

`(app)/layout.tsx` acts as the auth guard — redirects to `/login` if no valid token.

### Planned source structure

```
src/
├── app/
│   ├── (landing)/          # keru.me marketing pages
│   ├── (auth)/             # login + register (no nav)
│   └── (app)/              # protected app pages (bottom nav)
├── components/
│   ├── ui/                 # shadcn/ui auto-generated components
│   ├── app/                # app-specific components (forms, charts, nav)
│   ├── landing/            # marketing page components
│   └── shared/             # logo, loading spinner
├── hooks/                  # use-auth, use-expenses, use-income, use-tags, use-dashboard
├── context/
│   ├── auth-context.tsx    # AuthProvider (user, login, logout, isAuthenticated)
│   └── month-context.tsx   # MonthProvider (selected dashboard month, shared with the topbar chip)
├── lib/
│   ├── api.ts              # fetch wrapper — prepends API URL, attaches Bearer token, handles 401→refresh→retry
│   ├── auth.ts             # token storage and refresh logic
│   ├── utils.ts            # formatCurrency, formatDate
│   └── constants.ts        # API URL, tag colors, payment methods
├── types/                  # expense, income, tag, dashboard, auth, api (PaginatedResponse, ApiError)
└── middleware.ts            # subdomain routing
```

### Auth flow

```
Login/Register → API returns { access_token, refresh_token, expires_in }
Every request  → Authorization: Bearer <access_token>
On 401         → POST /auth/refresh → retry original request → else redirect /login
```

### State management (MVP)

No global state library. Auth state lives in `AuthProvider` (React Context). All server data is fetched per-page with `fetch` + `useEffect` + `useState`. Future upgrade path: React Query for server data, React Hook Form for validation.

### Design system

@DESIGN.md
@PLAN_DESIGN.md

Full design guidelines, color tokens, typography, spacing, and component patterns are in `DESIGN.md`.
The original visual redesign spec (intent, scope, and rationale) is in `PLAN_DESIGN.md`.

**Quick reference:**
- **Primary:** indigo `oklch(0.585 0.233 277)` — buttons, active nav, FAB, accents
- **Income:** `#22C55E` emerald green — amounts, income buttons (same in light/dark)
- **Hero gradient:** `linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)` — balance card, FAB, auth icon
- **Background:** near-white with indigo tint (light) / near-black (dark)
- Mobile-first. Desktop: fixed `w-60` sidebar + `max-w-4xl` content area.
- Page padding `px-5`, section gaps `mb-5`, card padding `p-4`, hero padding `p-6`.
- Shadow utilities: `shadow-card-sm`, `shadow-card-md`, `shadow-hero`, `shadow-colored` (all indigo-tinted)

## Next.js 16 Breaking Changes

- **Async Request APIs** — `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are **async only**. Always `await` them. Run `npx next typegen` to generate `PageProps` / `LayoutProps` / `RouteContext` helpers.
- **`next build` no longer lints** — run `npm run lint` separately.
- **Turbopack is default** — `--turbopack` flag no longer needed; use `--webpack` to opt out.
- **`experimental.turbopack`** moved to top-level `turbopack` in `next.config.ts`.
- **PPR** — `experimental_ppr` removed; use `cacheComponents: true` in `next.config.ts`.
- **Stable cache APIs** — `unstable_cacheLife` → `cacheLife`, `unstable_cacheTag` → `cacheTag` (from `next/cache`).
- **Middleware deprecated** — `middleware` convention replaced by `proxy`.

Read `node_modules/next/dist/docs/` for the full reference before writing any Next.js-specific code.
