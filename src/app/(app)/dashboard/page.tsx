"use client";

import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { BalanceCard } from "@/components/app/balance-card";
import { TrendsChart } from "@/components/app/trends-chart";
import { TopTags } from "@/components/app/top-tags";
import { RecentTransactions } from "@/components/app/recent-transactions";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

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

      {/* ── Mobile: stacked balance card ── */}
      {summary && (
        <div className="lg:hidden">
          <BalanceCard summary={summary} />
        </div>
      )}

      {/* ── Desktop: 3-card summary row ── */}
      {summary && (
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:mb-6">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={15} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Balance</span>
            </div>
            <p className="text-3xl font-semibold">{formatCurrency(summary.balance)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatMonth(summary.month)}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUp size={15} className="text-[#22C55E]" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Income</span>
            </div>
            <p className="text-3xl font-semibold text-[#22C55E]">{formatCurrency(summary.totalIncome)}</p>
            <p className="text-xs text-muted-foreground mt-1">{summary.incomeCount} entr{summary.incomeCount !== 1 ? "ies" : "y"}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowDown size={15} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Expenses</span>
            </div>
            <p className="text-3xl font-semibold">{formatCurrency(summary.totalExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">{summary.expenseCount} expense{summary.expenseCount !== 1 ? "s" : ""}</p>
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
