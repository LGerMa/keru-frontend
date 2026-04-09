# Keru — Keep Expenses Recorded & Understood

A mobile-first personal finance tracker that helps you stay on top of where your money goes — without the complexity of traditional budgeting apps.

Track income and expenses, organize by tags, and get a clear picture of your finances at a glance.

---

## Features

- **Dashboard** — balance overview, recent transactions, top spending tags, and income vs. expense trends
- **Expenses & Income** — log, filter, and browse transactions by month
- **Tags** — organize spending into custom categories with color labels
- **Profile** — manage your account

---

## Tech Stack

- **Framework:** Next.js 16.2.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Charts:** Recharts
- **Backend:** NestJS at `api.keru.me` (separate repo)
- **Domains:** `keru.me` (landing) · `app.keru.me` (webapp)

---

## Getting Started

```bash
npm install
npm run dev
```

Or with Docker (recommended — includes hot reload):

```bash
docker compose up
```

App runs at [http://localhost:3000](http://localhost:3000) (or `:3001` in Docker).

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_API_URL=https://api.keru.me
NEXT_PUBLIC_APP_URL=https://app.keru.me
```

---

## Design

See [DESIGN.md](DESIGN.md) for the full design system — colors, typography, spacing, and component patterns.
