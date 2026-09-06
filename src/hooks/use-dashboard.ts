"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { currentMonth } from "@/lib/utils";
import type { DashboardSummary, TagBreakdown, MonthTrend } from "@/types/dashboard";
import type { Expense } from "@/types/expense";
import type { PaginatedResponse } from "@/types/api";

interface DashboardData {
  summary: DashboardSummary | null;
  tagBreakdowns: TagBreakdown[];
  trends: MonthTrend[];
  recentExpenses: Expense[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(month?: string): DashboardData {
  const m = month ?? currentMonth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tagBreakdowns, setTagBreakdowns] = useState<TagBreakdown[]>([]);
  const [trends, setTrends] = useState<MonthTrend[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [y, mo] = m.split("-");
        const lastDay = new Date(Number(y), Number(mo), 0).getDate();

        const [s, tags, t, expenses] = await Promise.all([
          api.get<DashboardSummary>("/v1/dashboard/summary", { month: m }),
          api.get<TagBreakdown[]>("/v1/dashboard/by-tags", { month: m }),
          api.get<MonthTrend[]>("/v1/dashboard/trends", { months: 6 }),
          api.get<PaginatedResponse<Expense>>("/v1/expenses", {
            page: 1,
            take: 5,
            startDate: `${m}-01`,
            endDate: `${m}-${String(lastDay).padStart(2, "0")}`,
          }),
        ]);
        if (cancelled) return;
        setSummary(s);
        setTagBreakdowns(tags);
        setTrends(t);
        setRecentExpenses(expenses.items);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [m, tick]);

  return {
    summary,
    tagBreakdowns,
    trends,
    recentExpenses,
    isLoading,
    error,
    refetch: () => setTick((n) => n + 1),
  };
}
