"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Home, List, Plus, Tag, User, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home,  label: "Home" },
  { href: "/expenses",  icon: List,  label: "History" },
  { href: "/tags",      icon: Tag,   label: "Tags" },
  { href: "/profile",   icon: User,  label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <main className="flex-1 overflow-y-auto pb-20 px-5">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background border-t flex items-center justify-around h-16 px-2 z-50">
        {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 text-xs w-14",
              pathname.startsWith(href)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}

        {/* FAB — add expense or income */}
        <div className="relative flex items-center justify-center -mt-4">
          {fabOpen && (
            <>
              {/* backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setFabOpen(false)}
              />
              {/* options */}
              <div className="absolute bottom-14 flex flex-col items-center gap-2 z-50">
                <Link
                  href="/income/new"
                  onClick={() => setFabOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-white shadow-md whitespace-nowrap"
                  style={{ backgroundColor: "#22C55E" }}
                >
                  <TrendingUp size={14} />
                  Income
                </Link>
                <Link
                  href="/expenses/new"
                  onClick={() => setFabOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-white shadow-md whitespace-nowrap bg-primary"
                >
                  <List size={14} />
                  Expense
                </Link>
              </div>
            </>
          )}
          <button
            onClick={() => setFabOpen((o) => !o)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform"
            style={{ transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}
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
              pathname.startsWith(href)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
