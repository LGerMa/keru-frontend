"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { MonthProvider, useSelectedMonth } from "@/context/month-context";
import {
  Home, List, Plus, Tag, User,
  TrendingUp, Repeat2, Search,
  Bell, Sun, Moon, ChevronDown, Settings,
} from "lucide-react";
import Link from "next/link";
import { cn, formatMonth } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home,    labelKey: "dashboard" as const },
  { href: "/expenses",  icon: List,    labelKey: "transactions" as const },
  { href: "/recurring", icon: Repeat2, labelKey: "recurring" as const },
  { href: "/tags",      icon: Tag,     labelKey: "tags" as const },
  { href: "/profile",   icon: User,    labelKey: "profile" as const },
];

// ── Last 12 months, most recent first (as "YYYY-MM") ───────────
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});

// ── Month chip + dropdown ───────────────────────────────────────
function MonthChip() {
  const { month, setMonth } = useSelectedMonth();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {formatMonth(month, locale)}
        <ChevronDown size={11} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-card-md py-1 z-50">
          {MONTH_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => { setMonth(m); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                m === month
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {formatMonth(m, locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("Nav");
  const [fabOpen, setFabOpen] = useState(false);

  // ── Dark mode ────────────────────────────────────────────
  const [dark, setDark] = useState(false);

  // Read persisted preference after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("keruDark");
      if (stored === "1") setDark(true);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("keruDark", dark ? "1" : "0"); } catch {}
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ── Auth guard ───────────────────────────────────────────
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

  const isNavActive = (href: string) =>
    pathname === href ||
    (pathname.startsWith(href + "/") && !pathname.endsWith("/new"));

  const displayName =
    [user?.profile?.name, user?.profile?.lastname].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen lg:flex">

      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-60 border-r bg-card z-50 px-4 py-5 gap-5">

        {/* Wordmark */}
        <div className="px-2 pt-1">
          <span className="text-[22px] font-extrabold tracking-tight" style={{ letterSpacing: "-0.04em" }}>
            keru<span className="text-primary">.</span>
          </span>
        </div>

        {/* Quick-add buttons */}
        <div className="flex gap-2">
          <Link
            href="/income/new"
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ background: "#22C55E" }}
          >
            <TrendingUp size={13} strokeWidth={2.5} />
            {tNav("income")}
          </Link>
          <Link
            href="/expenses/new"
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary shadow-colored transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={13} strokeWidth={2.5} />
            {tNav("expense")}
          </Link>
        </div>

        {/* Nav section label */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
            {tNav("workspace")}
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                  isNavActive(href)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={16} />
                {tNav(labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User card */}
        <div className="border border-border rounded-2xl p-3 bg-background flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #818cf8)",
            }}
          >
            {initials || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">
              {displayName || "Account"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">
              {user?.email ?? ""}
            </p>
          </div>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <Settings size={13} />
          </Link>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* ── Desktop topbar ─────────────────────────────── */}
        <header className="hidden lg:flex items-center gap-3 h-[60px] px-8 border-b bg-background sticky top-0 z-40 flex-shrink-0">

          {/* Search */}
          <div className="relative flex-1 max-w-[380px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              placeholder={tNav("searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>

          <div className="flex-1" />

          {/* Month chip */}
          <MonthChip />

          {/* Notifications */}
          <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-card border border-border hover:bg-muted transition-colors">
            <Bell size={15} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? tNav("switchToLight") : tNav("switchToDark")}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-card border border-border hover:bg-muted transition-colors"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 px-5 max-w-md mx-auto w-full lg:max-w-4xl lg:pb-10 lg:px-10">
          {children}
        </main>

        {/* ── Bottom nav — mobile only ───────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t flex items-center justify-around h-16 px-2 z-50">
          {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-xs w-12",
                isNavActive(href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span>{tNav(labelKey)}</span>
            </Link>
          ))}

          {/* FAB */}
          <div className="relative flex items-center justify-center -mt-4">
            {fabOpen && (
              <>
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label="Close menu"
                  onClick={() => setFabOpen(false)}
                />
                <div className="absolute bottom-14 flex flex-col items-center gap-2 z-50">
                  <Link
                    href="/income/new"
                    onClick={() => setFabOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white shadow-card-md whitespace-nowrap"
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    <TrendingUp size={14} />
                    {tNav("income")}
                  </Link>
                  <Link
                    href="/expenses/new"
                    onClick={() => setFabOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-white shadow-colored whitespace-nowrap bg-primary"
                  >
                    <Plus size={14} />
                    {tNav("expense")}
                  </Link>
                </div>
              </>
            )}
            <button
              onClick={() => setFabOpen((o) => !o)}
              className="flex items-center justify-center w-12 h-12 gradient-hero text-white shadow-hero transition-transform hover:scale-105 active:scale-95"
              style={{
                borderRadius: "14px",
                transition: "transform 0.2s",
                transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
              aria-label="Add transaction"
            >
              <Plus size={24} />
            </button>
          </div>

          {NAV_ITEMS.slice(2).map(({ href, icon: Icon, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-xs w-12",
                isNavActive(href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span>{tNav(labelKey)}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MonthProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </MonthProvider>
  );
}
