"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "@/types/expense";
import type { PaginatedResponse, PageMeta } from "@/types/api";

interface UseExpensesOptions {
  page?: number;
  take?: number;
  /** "YYYY-MM" — converted to startDate/endDate for the API */
  month?: string;
  /** comma-separated tag names */
  tags?: string;
}

interface UseExpensesReturn {
  expenses: Expense[];
  meta: PageMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExpenses({ page = 1, take = 20, month, tags }: UseExpensesOptions = {}): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number | boolean> = { page, take };
        if (month) {
          const [y, m] = month.split("-");
          const last = new Date(Number(y), Number(m), 0).getDate();
          params.startDate = `${month}-01`;
          params.endDate = `${month}-${String(last).padStart(2, "0")}`;
        }
        if (tags) params.tags = tags;
        const res = await api.get<PaginatedResponse<Expense>>("/v1/expenses", params);
        if (cancelled) return;
        setExpenses(res.items);
        setMeta(res.meta);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, take, month, tags, tick]);

  return {
    expenses,
    meta,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createExpense(dto: CreateExpenseDto): Promise<Expense> {
  return api.post<Expense>("/v1/expenses", dto);
}

export async function updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense> {
  return api.patch<Expense>(`/v1/expenses/${id}`, dto);
}

export async function deleteExpense(id: string): Promise<void> {
  return api.delete(`/v1/expenses/${id}`);
}

export async function getExpense(id: string): Promise<Expense> {
  return api.get<Expense>(`/v1/expenses/${id}`);
}
