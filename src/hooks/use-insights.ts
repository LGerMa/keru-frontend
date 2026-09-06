"use client";

// use-insights.ts
// Computes quick-stat insights client-side from existing dashboard data.
// When GET /dashboard/insights is implemented on the backend, swap the
// computation here for a single API call and return the same shape.
//
// PENDING endpoint: GET /dashboard/insights?month=YYYY-MM
// See REDESIGN_PLAN.md for the full response shape.

import { useMemo } from "react";
import type { DashboardSummary, TagBreakdown } from "@/types/dashboard";

export interface DashboardInsights {
  dailyAverage: number;
  topCategory: { name: string; color: string; amount: number } | null;
  transactionCount: number;
  expenseCount: number;
  incomeCount: number;
  daysIntoMonth: number;
}

interface UseInsightsInput {
  summary: DashboardSummary | null;
  tagBreakdowns: TagBreakdown[];
}

export function useInsights({
  summary,
  tagBreakdowns,
}: UseInsightsInput): DashboardInsights | null {
  return useMemo(() => {
    if (!summary) return null;

    // How many days have passed in the current month (inclusive of today)
    const [year, month] = summary.month.split("-").map(Number);
    const today = new Date();
    const daysIntoMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month
        ? today.getDate()
        : new Date(year, month, 0).getDate(); // full month if historical

    const dailyAverage =
      daysIntoMonth > 0 ? summary.totalExpenses / daysIntoMonth : 0;

    const topBreakdown = [...tagBreakdowns]
      .filter((b) => !b.untagged)
      .sort((a, b) => b.total - a.total)[0] ?? null;

    return {
      dailyAverage,
      topCategory: topBreakdown
        ? {
            name: topBreakdown.tag.name,
            color: topBreakdown.tag.color,
            amount: topBreakdown.total,
          }
        : null,
      transactionCount: summary.expenseCount + summary.incomeCount,
      expenseCount: summary.expenseCount,
      incomeCount: summary.incomeCount,
      daysIntoMonth,
    };
  }, [summary, tagBreakdowns]);
}
