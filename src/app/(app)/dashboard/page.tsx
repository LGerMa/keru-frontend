"use client";

import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { BalanceCard } from "@/components/app/balance-card";
import { TrendsChart } from "@/components/app/trends-chart";
import { TopTags } from "@/components/app/top-tags";
import { RecentTransactions } from "@/components/app/recent-transactions";

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
        {greeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </p>

      {summary && <BalanceCard summary={summary} />}

      {trends.length > 0 && <TrendsChart trends={trends} />}

      {tagBreakdowns.length > 0 && <TopTags breakdowns={tagBreakdowns} />}

      <RecentTransactions expenses={recentExpenses} />
    </div>
  );
}
