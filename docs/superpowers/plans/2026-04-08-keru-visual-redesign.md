# Keru Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the neutral grayscale theme with a fresh indigo-primary design system across all app pages, including dark mode.

**Architecture:** Start with CSS design tokens (Task 1) — all downstream changes automatically inherit the new colors. Then rebuild the layout shell and each page in dependency order. No logic, routing, or API code changes.

**Tech Stack:** Next.js 16, Tailwind CSS v4, shadcn/ui, recharts, lucide-react, TypeScript.

---

## File Map

| File | Change |
|---|---|
| `src/app/globals.css` | Full token redesign — indigo palette, dark mode, radius, shadow utilities |
| `src/app/(app)/layout.tsx` | `keru.` wordmark, pill active nav, rounded-square FAB |
| `src/app/(auth)/login/page.tsx` | Branded icon mark, indigo button |
| `src/app/(auth)/register/page.tsx` | Same treatment as login |
| `src/components/app/balance-card.tsx` | Full rewrite — indigo gradient hero card |
| `src/components/app/transaction-item.tsx` | Icon badge, amount color weight |
| `src/components/app/recent-transactions.tsx` | White card wrapper, uppercase section label |
| `src/components/app/top-tags.tsx` | Uppercase section label, `See all` color |
| `src/components/app/trends-chart.tsx` | Indigo bar color, fix `hsl(var(...))` → `var(...)` |
| `src/app/(app)/dashboard/page.tsx` | Quick-action buttons, desktop stat card styles |
| `src/app/(app)/expenses/page.tsx` | Tab switcher, month pill chips, list card container |
| `src/app/(app)/profile/page.tsx` | Option B: avatar card row, remove gradient hero |
| `src/app/(app)/tags/page.tsx` | Card row per tag with shadow |

---

## Task 1: Design Tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

Replace the entire file with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  /* Radius: base = 16px, multipliers give 4/10/16/20/24/32/40px */
  --radius-sm: calc(var(--radius) * 0.25);
  --radius-md: calc(var(--radius) * 0.625);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.25);
  --radius-2xl: calc(var(--radius) * 1.5);
  --radius-3xl: calc(var(--radius) * 2);
  --radius-4xl: calc(var(--radius) * 2.5);
}

:root {
  --background: oklch(0.985 0.012 277);
  --foreground: oklch(0.148 0.028 277);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.148 0.028 277);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.148 0.028 277);
  --primary: oklch(0.585 0.233 277);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.958 0.018 277);
  --secondary-foreground: oklch(0.148 0.028 277);
  --muted: oklch(0.958 0.018 277);
  --muted-foreground: oklch(0.558 0.042 277);
  --accent: oklch(0.958 0.018 277);
  --accent-foreground: oklch(0.148 0.028 277);
  --destructive: oklch(0.628 0.247 27.3);
  --border: oklch(0.928 0.028 277);
  --input: oklch(0.928 0.028 277);
  --ring: oklch(0.585 0.233 277);
  --chart-1: oklch(0.757 0.148 277);
  --chart-2: oklch(0.675 0.179 277);
  --chart-3: oklch(0.585 0.233 277);
  --chart-4: oklch(0.507 0.264 277);
  --chart-5: oklch(0.723 0.219 149.6);
  --radius: 1rem;
  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.148 0.028 277);
  --sidebar-primary: oklch(0.585 0.233 277);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.958 0.018 277);
  --sidebar-accent-foreground: oklch(0.148 0.028 277);
  --sidebar-border: oklch(0.928 0.028 277);
  --sidebar-ring: oklch(0.585 0.233 277);
  --income: #22C55E;
}

.dark {
  --background: oklch(0.098 0.022 277);
  --foreground: oklch(0.968 0.018 277);
  --card: oklch(0.128 0.026 277);
  --card-foreground: oklch(0.968 0.018 277);
  --popover: oklch(0.128 0.026 277);
  --popover-foreground: oklch(0.968 0.018 277);
  --primary: oklch(0.675 0.179 277);
  --primary-foreground: oklch(0.098 0.022 277);
  --secondary: oklch(0.162 0.032 277);
  --secondary-foreground: oklch(0.968 0.018 277);
  --muted: oklch(0.162 0.032 277);
  --muted-foreground: oklch(0.438 0.042 277);
  --accent: oklch(0.162 0.032 277);
  --accent-foreground: oklch(0.968 0.018 277);
  --destructive: oklch(0.740 0.192 27.3);
  --border: oklch(0.162 0.032 277);
  --input: oklch(0.162 0.032 277);
  --ring: oklch(0.675 0.179 277);
  --chart-1: oklch(0.757 0.148 277);
  --chart-2: oklch(0.675 0.179 277);
  --chart-3: oklch(0.585 0.233 277);
  --chart-4: oklch(0.507 0.264 277);
  --chart-5: oklch(0.723 0.219 149.6);
  --sidebar: oklch(0.128 0.026 277);
  --sidebar-foreground: oklch(0.968 0.018 277);
  --sidebar-primary: oklch(0.675 0.179 277);
  --sidebar-primary-foreground: oklch(0.968 0.018 277);
  --sidebar-accent: oklch(0.162 0.032 277);
  --sidebar-accent-foreground: oklch(0.968 0.018 277);
  --sidebar-border: oklch(0.162 0.032 277);
  --sidebar-ring: oklch(0.675 0.179 277);
  --income: #22C55E;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

@layer utilities {
  .gradient-hero {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%);
  }
  .shadow-card-sm {
    box-shadow: 0 1px 3px rgba(99, 102, 241, 0.06), 0 1px 2px rgba(99, 102, 241, 0.04);
  }
  .shadow-card-md {
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.08), 0 1px 4px rgba(99, 102, 241, 0.06);
  }
  .shadow-card-lg {
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15), 0 2px 8px rgba(99, 102, 241, 0.10);
  }
  .shadow-hero {
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.35);
  }
  .shadow-colored {
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.40);
  }
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors. If you see "Unknown at-rule `@theme`" it's a lint rule issue, not a real error — check `eslint` vs `stylelint`.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: redesign CSS tokens — indigo palette, dark mode, radius 16px base"
```

---

## Task 2: Layout Shell

**Files:**
- Modify: `src/app/(app)/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Replace the file with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Home, List, Plus, Tag, User, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/expenses",  icon: List, label: "History" },
  { href: "/tags",      icon: Tag,  label: "Tags" },
  { href: "/profile",   icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const displayName =
    [user?.profile?.name, user?.profile?.lastname].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <div className="min-h-screen lg:flex">
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-60 border-r bg-card z-50 px-4 py-6">
        {/* Logo */}
        <div className="mb-8 px-2">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            keru<span className="text-primary">.</span>
          </span>
        </div>

        {/* New transaction */}
        <div className="relative mb-6">
          <button
            onClick={() => setFabOpen((o) => !o)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-colored transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
            New transaction
          </button>
          {fabOpen && (
            <>
              <button className="fixed inset-0 z-40 cursor-default" aria-label="Close menu" onClick={() => setFabOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 flex flex-col gap-1.5 z-50">
                <Link
                  href="/income/new"
                  onClick={() => setFabOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white shadow-card-md"
                  style={{ backgroundColor: "#22C55E" }}
                >
                  <TrendingUp size={15} />
                  Income
                </Link>
                <Link
                  href="/expenses/new"
                  onClick={() => setFabOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white shadow-colored bg-primary"
                >
                  <List size={15} />
                  Expense
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                pathname.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        {displayName && (
          <div className="pt-4 border-t px-2">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold truncate">{displayName}</p>
          </div>
        )}
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 px-5 max-w-md mx-auto w-full lg:max-w-4xl lg:pb-10 lg:px-10">
          {children}
        </main>

        {/* ── Bottom nav — mobile only ──────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t flex items-center justify-around h-16 px-2 z-50">
          {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-xs w-14",
                pathname.startsWith(href) ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}

          {/* FAB — rounded square */}
          <div className="relative flex items-center justify-center -mt-4">
            {fabOpen && (
              <>
                <button className="fixed inset-0 z-40 cursor-default" aria-label="Close menu" onClick={() => setFabOpen(false)} />
                <div className="absolute bottom-14 flex flex-col items-center gap-2 z-50">
                  <Link
                    href="/income/new"
                    onClick={() => setFabOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white shadow-card-md whitespace-nowrap"
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    <TrendingUp size={14} />
                    Income
                  </Link>
                  <Link
                    href="/expenses/new"
                    onClick={() => setFabOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white shadow-colored whitespace-nowrap bg-primary"
                  >
                    <List size={14} />
                    Expense
                  </Link>
                </div>
              </>
            )}
            <button
              onClick={() => setFabOpen((o) => !o)}
              className="flex items-center justify-center w-12 h-12 gradient-hero text-white shadow-hero transition-transform hover:scale-105 active:scale-95"
              style={{
                borderRadius: "14px",
                transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
              aria-label="Add transaction"
            >
              <Plus size={24} />
            </button>
          </div>

          {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-xs w-14",
                pathname.startsWith(href) ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/layout.tsx
git commit -m "feat: layout shell — keru. wordmark, pill nav active, rounded-square FAB"
```

---

## Task 3: Login & Register Pages

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Update login/page.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 gradient-hero text-white text-xl font-extrabold shadow-colored"
          style={{ borderRadius: "14px" }}
        >
          K
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            keru<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Keep Expenses Recorded & Understood</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-colored transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-semibold">
          Register
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Update register/page.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 gradient-hero text-white text-xl font-extrabold shadow-colored"
          style={{ borderRadius: "14px" }}
        >
          K
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            keru<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Keep Expenses Recorded & Understood</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-colored transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1"
        >
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Lint and build**

```bash
npm run lint && npm run build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(auth)/login/page.tsx src/app/(auth)/register/page.tsx
git commit -m "feat: auth pages — branded K icon, indigo button, keru. wordmark"
```

---

## Task 4: BalanceCard — Hero Gradient

**Files:**
- Modify: `src/components/app/balance-card.tsx`

- [ ] **Step 1: Rewrite balance-card.tsx**

```tsx
import { formatCurrency, formatMonth } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

interface BalanceCardProps {
  summary: DashboardSummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <div className="gradient-hero rounded-3xl p-6 mb-5 shadow-hero">
      <p className="text-xs text-white/60 uppercase tracking-widest font-medium mb-2">
        {formatMonth(summary.month)}
      </p>
      <p className="text-4xl font-extrabold text-white tracking-tight" style={{ letterSpacing: "-1.5px" }}>
        {formatCurrency(summary.balance)}
      </p>
      <div className="flex gap-6 mt-4">
        <div>
          <p className="text-xs text-white/50 mb-0.5">↑ Income</p>
          <p className="text-sm font-bold text-emerald-300">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-0.5">↓ Expenses</p>
          <p className="text-sm font-bold text-white/80">{formatCurrency(summary.totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/app/balance-card.tsx
git commit -m "feat: balance card — indigo gradient hero with income/expense rows"
```

---

## Task 5: TransactionItem — Icon Badge

**Files:**
- Modify: `src/components/app/transaction-item.tsx`

- [ ] **Step 1: Rewrite transaction-item.tsx**

```tsx
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";

type Transaction =
  | ({ kind: "expense" } & Expense)
  | ({ kind: "income" } & Income);

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.kind === "expense";
  const href = isExpense
    ? `/expenses/${transaction.id}`
    : `/income/${transaction.id}`;
  const primaryTag = transaction.tags[0];
  const description = transaction.description ?? (isExpense ? "Expense" : "Income");
  const badgeLetter = description[0]?.toUpperCase() ?? (isExpense ? "E" : "I");
  const badgeBg = isExpense ? "rgba(99,102,241,0.10)" : "rgba(34,197,94,0.12)";
  const badgeColor = isExpense ? "#6366f1" : "#22C55E";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/40 transition-colors -mx-1 px-1 rounded-lg"
    >
      {/* Icon badge */}
      <div
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-[10px] text-sm font-bold"
        style={{ backgroundColor: primaryTag ? `${primaryTag.color}18` : badgeBg, color: primaryTag?.color ?? badgeColor }}
      >
        {badgeLetter}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(transaction.date, { month: "short", day: "numeric" })}
          {primaryTag && <span> · {primaryTag.name}</span>}
        </p>
      </div>

      <p className={`text-sm font-bold flex-shrink-0 ${isExpense ? "text-foreground" : "text-[#22C55E]"}`}>
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount)}
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/app/transaction-item.tsx
git commit -m "feat: transaction item — icon badge with tag color, bold amounts"
```

---

## Task 6: RecentTransactions + TopTags

**Files:**
- Modify: `src/components/app/recent-transactions.tsx`
- Modify: `src/components/app/top-tags.tsx`

- [ ] **Step 1: Update recent-transactions.tsx**

```tsx
import Link from "next/link";
import { TransactionItem } from "./transaction-item";
import type { Expense } from "@/types/expense";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Recent</p>
        <Link href="/expenses" className="text-xs text-primary font-semibold">
          See all
        </Link>
      </div>
      <div className="bg-card rounded-2xl shadow-card-md overflow-hidden px-1">
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet</p>
        ) : (
          expenses.map((expense) => (
            <TransactionItem
              key={expense.id}
              transaction={{ kind: "expense", ...expense }}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update top-tags.tsx**

```tsx
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { TagBreakdown } from "@/types/dashboard";

interface TopTagsProps {
  breakdowns: TagBreakdown[];
}

export function TopTags({ breakdowns }: TopTagsProps) {
  if (breakdowns.length === 0) return null;

  const tagged = breakdowns.filter((b) => !b.untagged);
  const grandTotal = tagged.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Top tags</p>
        <Link href="/tags" className="text-xs text-primary font-semibold">
          See all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {tagged.map(({ tag, total }) => {
          const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
          return (
            <Link
              key={tag.id}
              href={`/expenses?tag=${encodeURIComponent(tag.name)}`}
              className="flex-shrink-0 rounded-xl p-3 min-w-[90px] active:opacity-70 transition-opacity shadow-card-sm"
              style={{ backgroundColor: `${tag.color}18` }}
            >
              <p className="text-xs font-semibold" style={{ color: tag.color }}>
                {tag.name}
              </p>
              <p className="text-sm font-bold mt-1 text-foreground">
                {formatCurrency(total)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pct.toFixed(0)}%
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/app/recent-transactions.tsx src/components/app/top-tags.tsx
git commit -m "feat: recent transactions + top tags — white card container, uppercase labels"
```

---

## Task 7: TrendsChart

**Files:**
- Modify: `src/components/app/trends-chart.tsx`

- [ ] **Step 1: Update trends-chart.tsx**

```tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MonthTrend } from "@/types/dashboard";

interface TrendsChartProps {
  trends: MonthTrend[];
}

function shortMonth(month: string): string {
  const [year, m] = month.split("-");
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(Number(year), Number(m) - 1)
  );
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const data = trends.map((t) => ({
    month: shortMonth(t.month),
    income: t.totalIncome,
    expenses: t.totalExpenses,
  }));

  return (
    <div className="mb-5 bg-card rounded-2xl shadow-card-md p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Spending Trends</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(99,102,241,0.1)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "oklch(0.558 0.042 277)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{
              fontSize: 12,
              borderRadius: 10,
              border: "1px solid oklch(0.928 0.028 277)",
              boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
            }}
          />
          <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/app/trends-chart.tsx
git commit -m "feat: trends chart — indigo expense bars, card wrapper, fix var() references"
```

---

## Task 8: Dashboard Page

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Update dashboard/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { BalanceCard } from "@/components/app/balance-card";
import { TrendsChart } from "@/components/app/trends-chart";
import { TopTags } from "@/components/app/top-tags";
import { RecentTransactions } from "@/components/app/recent-transactions";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { Plus, TrendingUp } from "lucide-react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { summary, tagBreakdowns, trends, recentExpenses, isLoading, error } =
    useDashboard();

  if (isLoading) {
    return (
      <div className="pt-6 flex justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <p className="text-sm text-muted-foreground mb-5">
        {greeting()}{user?.profile?.name ? `, ${user.profile.name.split(" ")[0]}` : ""}
      </p>

      {/* ── Mobile: hero balance card ── */}
      {summary && (
        <div className="lg:hidden">
          <BalanceCard summary={summary} />
          {/* Quick action buttons */}
          <div className="flex gap-3 mb-5">
            <Link
              href="/expenses/new"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-colored"
            >
              <Plus size={15} />
              Expense
            </Link>
            <Link
              href="/income/new"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-card text-foreground text-sm font-semibold border border-border shadow-card-sm"
            >
              <TrendingUp size={15} />
              Income
            </Link>
          </div>
        </div>
      )}

      {/* ── Desktop: 3-card summary row ── */}
      {summary && (
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:mb-6">
          {/* Balance — indigo gradient */}
          <div className="gradient-hero rounded-2xl p-5 shadow-hero">
            <p className="text-xs text-white/60 uppercase tracking-widest font-medium mb-2">Balance</p>
            <p className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-1px" }}>
              {formatCurrency(summary.balance)}
            </p>
            <p className="text-xs text-white/50 mt-1">{formatMonth(summary.month)}</p>
          </div>
          {/* Income */}
          <div className="rounded-2xl bg-card p-5 shadow-card-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-2">Income</p>
            <p className="text-3xl font-extrabold text-[#22C55E]" style={{ letterSpacing: "-1px" }}>
              {formatCurrency(summary.totalIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.incomeCount} {summary.incomeCount !== 1 ? "entries" : "entry"}
            </p>
          </div>
          {/* Expenses */}
          <div className="rounded-2xl bg-card p-5 shadow-card-md border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-2">Expenses</p>
            <p className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: "-1px" }}>
              {formatCurrency(summary.totalExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.expenseCount} {summary.expenseCount !== 1 ? "expenses" : "expense"}
            </p>
          </div>
        </div>
      )}

      {/* ── Desktop: chart + recent side-by-side ── */}
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
        <div>
          {trends.length > 0 && <TrendsChart trends={trends} />}
          {tagBreakdowns.length > 0 && <TopTags breakdowns={tagBreakdowns} />}
        </div>
        <div>
          <RecentTransactions expenses={recentExpenses} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/dashboard/page.tsx
git commit -m "feat: dashboard — gradient stat cards, quick action buttons mobile"
```

---

## Task 9: History Page

**Files:**
- Modify: `src/app/(app)/expenses/page.tsx`

- [ ] **Step 1: Update expenses/page.tsx**

Replace the file with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncome } from "@/hooks/use-income";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { currentMonth, formatMonth } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "expenses" | "income";

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("expenses");
  const [month, setMonth] = useState<string>(currentMonth());
  const [tagFilter, setTagFilter] = useState<string>(
    () => searchParams.get("tag") ?? ""
  );

  const { expenses, meta: expMeta, isLoading: expLoading, error: expError } =
    useExpenses({ month, tags: tagFilter || undefined });
  const { income, meta: incMeta, isLoading: incLoading, error: incError } =
    useIncome({ month });

  const isLoading = tab === "expenses" ? expLoading : incLoading;
  const error     = tab === "expenses" ? expError   : incError;
  const items     = tab === "expenses" ? expenses   : income;
  const meta      = tab === "expenses" ? expMeta    : incMeta;
  const addHref   = tab === "expenses" ? "/expenses/new" : "/income/new";
  const addLabel  = tab === "expenses" ? "Add expense"   : "Add income";
  const emptyTitle = tab === "expenses" ? "No expenses yet" : "No income yet";
  const count = meta?.itemCount ?? 0;
  const countLabel =
    tab === "expenses"
      ? `${count} ${count === 1 ? "expense" : "expenses"} this month`
      : `${count} ${count === 1 ? "entry" : "entries"} this month`;

  const isIncome = tab === "income";

  const FilterControls = (
    <>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 bg-card rounded-xl p-1 border border-border">
        {(["expenses", "income"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize",
              tab === t
                ? t === "income"
                  ? "text-white"
                  : "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            style={tab === t && t === "income" ? { backgroundColor: "#22C55E" } : {}}
          >
            {t === "expenses" ? "Expenses" : "Income"}
          </button>
        ))}
      </div>

      {/* Active tag filter */}
      {tagFilter && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-muted-foreground">Filtered by:</span>
          <button
            onClick={() => setTagFilter("")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
          >
            {tagFilter}
            <X size={11} />
          </button>
        </div>
      )}

      {/* Month picker */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 hidden lg:block">Month</p>
        {/* Mobile: horizontal scroll pill chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
          {MONTHS.map((m) => {
            const isSelected = month === m;
            return (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  isSelected && !isIncome && "bg-primary text-primary-foreground border-primary",
                  isSelected && isIncome && "border-transparent text-white",
                  !isSelected && "bg-card text-muted-foreground border-border"
                )}
                style={isSelected && isIncome ? { backgroundColor: "#22C55E", borderColor: "#22C55E" } : {}}
              >
                {formatMonth(m).split(" ")[0]}
              </button>
            );
          })}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden lg:flex lg:flex-col lg:gap-1">
          {MONTHS.map((m) => {
            const isSelected = month === m;
            return (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  isSelected && !isIncome && "bg-primary text-primary-foreground",
                  isSelected && isIncome && "text-white",
                  !isSelected && "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={isSelected && isIncome ? { backgroundColor: "#22C55E" } : {}}
              >
                {formatMonth(m)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  const TransactionList = (
    <>
      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title={emptyTitle}
          description={`Nothing recorded for ${formatMonth(month)}`}
          action={
            <Link href={addHref} className="text-xs text-primary font-semibold underline underline-offset-4">
              Add now
            </Link>
          }
        />
      )}
      {!isLoading && items.length > 0 && (
        <div>
          <div className="bg-card rounded-2xl shadow-card-md px-1 overflow-hidden">
            {tab === "expenses"
              ? expenses.map((e) => (
                  <TransactionItem key={e.id} transaction={{ kind: "expense", ...e }} />
                ))
              : income.map((e) => (
                  <TransactionItem key={e.id} transaction={{ kind: "income", ...e }} />
                ))}
          </div>
          {meta && (
            <p className="text-xs text-muted-foreground text-center mt-4">{countLabel}</p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">History</h1>
        <Link href={addHref} className="flex items-center gap-1 text-xs text-primary font-semibold">
          <Plus size={14} />
          {addLabel}
        </Link>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {FilterControls}
        {TransactionList}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
        <div className="sticky top-6 self-start">
          {FilterControls}
        </div>
        <div>{TransactionList}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/expenses/page.tsx
git commit -m "feat: history page — pill month chips, indigo tab switcher, card list container"
```

---

## Task 10: Profile Page

**Files:**
- Modify: `src/app/(app)/profile/page.tsx`

- [ ] **Step 1: Update profile/page.tsx**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { api } from "@/lib/api";
import { LogOut, Pencil, X, Check } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuthContext();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [name, setName] = useState(user?.profile.name ?? "");
  const [lastname, setLastname] = useState(user?.profile.lastname ?? "");
  const [bio, setBio] = useState(user?.profile.bio ?? "");

  function startEdit() {
    setName(user?.profile.name ?? "");
    setLastname(user?.profile.lastname ?? "");
    setBio(user?.profile.bio ?? "");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function save() {
    setIsSaving(true);
    try {
      await api.patch("/v1/users/me", {
        name: name.trim() || null,
        lastname: lastname.trim() || null,
        bio: bio.trim() || null,
      });
      await refreshUser();
      setEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  const displayName = [user.profile.name, user.profile.lastname]
    .filter(Boolean)
    .join(" ") || "No name set";

  const initials = [user.profile.name, user.profile.lastname]
    .filter(Boolean)
    .map((s) => s![0].toUpperCase())
    .join("") || user.email[0].toUpperCase();

  return (
    <div className="pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-tight">Profile</h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm text-primary font-semibold"
          >
            <Pencil size={14} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={cancelEdit} className="text-muted-foreground">
              <X size={20} />
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex items-center gap-1 text-sm text-primary font-semibold disabled:opacity-50"
            >
              <Check size={16} />
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Avatar card row — Option B */}
      <div className="bg-card rounded-2xl shadow-card-md border border-border p-4 flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 flex-shrink-0 flex items-center justify-center gradient-hero text-white text-xl font-extrabold shadow-colored"
          style={{ borderRadius: "14px" }}
        >
          {initials}
        </div>
        <div>
          <p className="text-base font-bold text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-primary font-medium mt-0.5">
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Fields */}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">First name</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Last name</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Bio</label>
            <textarea
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio…"
            />
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
          <InfoRow label="First name" value={user.profile.name ?? "—"} />
          <InfoRow label="Last name" value={user.profile.lastname ?? "—"} />
          {user.profile.bio && <InfoRow label="Bio" value={user.profile.bio} />}
        </div>
      )}

      {/* Sign out */}
      {!editing && (
        <div className="mt-8">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold disabled:opacity-50"
          >
            <LogOut size={15} />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground font-medium w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-right flex-1">{value}</span>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/profile/page.tsx
git commit -m "feat: profile page — avatar card row with gradient badge, clean layout"
```

---

## Task 11: Tags Page

**Files:**
- Modify: `src/app/(app)/tags/page.tsx`

- [ ] **Step 1: Update the tag list rendering inside tags/page.tsx**

Only the list rendering block changes — all dialog/form logic stays identical. Replace the `{!isLoading && tags.length > 0 && (...)}` block:

```tsx
{!isLoading && tags.length > 0 && (
  <div className="flex flex-col gap-2">
    {tags.map((tag) => (
      <div
        key={tag.id}
        className="bg-card rounded-2xl shadow-card-sm border border-border flex items-center gap-3 px-4 py-3"
      >
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: tag.color }}
        />
        <span className="flex-1 text-sm font-semibold" style={{ color: tag.color }}>
          {tag.name}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openEdit(tag)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(tag.id)}
            disabled={deletingId === tag.id}
            className="text-destructive disabled:opacity-40"
            aria-label="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    ))}
  </div>
)}
```

Also update the page header `h1` and `+ New tag` button:

```tsx
{/* Replace the existing header div */}
<div className="flex items-center justify-between mb-5">
  <h1 className="text-lg font-bold tracking-tight">Tags</h1>
  <button
    onClick={() => { setShowCreate(true); setCreateForm(DEFAULT_FORM); }}
    className="flex items-center gap-1 text-xs text-primary font-semibold"
  >
    <Plus size={14} />
    New tag
  </button>
</div>
```

- [ ] **Step 2: Lint and build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000` (or the Docker port). Check all 5 pages in light mode. Then add `class="dark"` to `<html>` in layout.tsx temporarily to verify dark mode tokens look correct. Revert after checking.

- [ ] **Step 4: Commit**

```bash
git add src/app/(app)/tags/page.tsx
git commit -m "feat: tags page — card rows with shadow, consistent header style"
```

---

## Done

All 11 tasks produce a complete visual redesign. At this point:
- `globals.css` carries the full indigo token system + dark mode
- All pages use the new tokens via Tailwind classes — no hardcoded colors except `#22C55E` (income, intentional)
- The `gradient-hero`, `shadow-*`, and `shadow-card-*` utilities are available globally
- Dark mode is functional via `.dark` CSS class (controlled by `next-themes` or manual toggle)
