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

  const isNavActive = (href: string) =>
    pathname === href || (pathname.startsWith(href + "/") && !pathname.endsWith("/new"));

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
        <div className="flex gap-2 mb-6">
          <Link
            href="/income/new"
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-semibold text-white shadow-card-md transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#22C55E" }}
          >
            <TrendingUp size={15} />
            Income
          </Link>
          <Link
            href="/expenses/new"
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-semibold text-white shadow-colored bg-primary transition-transform hover:scale-105 active:scale-95"
          >
            <List size={15} />
            Expense
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                isNavActive(href)
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
                isNavActive(href) ? "text-primary font-semibold" : "text-muted-foreground"
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
                isNavActive(href) ? "text-primary font-semibold" : "text-muted-foreground"
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
