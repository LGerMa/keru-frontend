"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { currentMonth } from "@/lib/utils";
import type { BudgetRule } from "@/types/dashboard";

interface UseBudgetRuleReturn {
  rule: BudgetRule | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/** 50/30/20 needs/wants/savings split for a month. Loads independently of useDashboard. */
export function useBudgetRule(month?: string): UseBudgetRuleReturn {
  const m = month ?? currentMonth();

  const [rule, setRule] = useState<BudgetRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await api.get<BudgetRule>("/v1/dashboard/budget-rule", { month: m });
        if (cancelled) return;
        setRule(data);
        setError(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [m, tick]);

  return {
    rule,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}
