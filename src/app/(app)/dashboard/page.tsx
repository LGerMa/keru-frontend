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
