"use client";

// use-balance-delta.ts
// Computes month-over-month balance delta client-side from the trends array.
// When GET /dashboard/balance-delta is implemented on the backend, replace
// the computation below with a single API call returning the same shape.
//
// PENDING endpoint: GET /dashboard/balance-delta?month=YYYY-MM
// See REDESIGN_PLAN.md for the full response shape.

import { useMemo } from "react";
import type { MonthTrend } from "@/types/dashboard";

export interface BalanceDelta {
  balanceDelta: number | null;   // percent change in (income - expenses)
  expensesDelta: number | null;  // percent change in expenses
  incomeDelta: number | null;    // percent change in income
}

export function useBalanceDelta(
  trends: MonthTrend[],
  currentMonth: string
): BalanceDelta {
  return useMemo(() => {
    if (trends.length < 2) {
      return { balanceDelta: null, expensesDelta: null, incomeDelta: null };
    }

    // Find current and previous month entries
    const current = trends.find((t) => t.month === currentMonth);
    if (!current) {
      return { balanceDelta: null, expensesDelta: null, incomeDelta: null };
    }

    const currentIdx = trends.indexOf(current);
    const previous = trends[currentIdx - 1] ?? null;
    if (!previous) {
      return { balanceDelta: null, expensesDelta: null, incomeDelta: null };
    }

    const pctChange = (curr: number, prev: number): number | null => {
      if (prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    };

    const currentBalance = current.totalIncome - current.totalExpenses;
    const previousBalance = previous.totalIncome - previous.totalExpenses;

    return {
      balanceDelta: pctChange(currentBalance, previousBalance),
      expensesDelta: pctChange(current.totalExpenses, previous.totalExpenses),
      incomeDelta: pctChange(current.totalIncome, previous.totalIncome),
    };
  }, [trends, currentMonth]);
}
