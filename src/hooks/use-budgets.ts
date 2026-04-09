"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Budget, BudgetStatus, CreateBudgetDto, UpdateBudgetDto } from "@/types/budget";

interface UseBudgetsReturn {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBudgets(): UseBudgetsReturn {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<Budget[]>("/v1/budgets");
        if (cancelled) return;
        setBudgets(data);
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
  }, [tick]);

  return {
    budgets,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

interface UseBudgetStatusReturn {
  statuses: BudgetStatus[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBudgetStatus(): UseBudgetStatusReturn {
  const [statuses, setStatuses] = useState<BudgetStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<BudgetStatus[]>("/v1/budgets/status");
        if (cancelled) return;
        setStatuses(data);
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
  }, [tick]);

  return {
    statuses,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createBudget(dto: CreateBudgetDto): Promise<Budget> {
  return api.post<Budget>("/v1/budgets", dto);
}

export async function updateBudget(id: string, dto: UpdateBudgetDto): Promise<Budget> {
  return api.patch<Budget>(`/v1/budgets/${id}`, dto);
}

export async function deleteBudget(id: string): Promise<void> {
  return api.delete(`/v1/budgets/${id}`);
}
