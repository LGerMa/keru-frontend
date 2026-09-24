"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Income, CreateIncomeDto, UpdateIncomeDto } from "@/types/income";
import type { PaginatedResponse, PageMeta } from "@/types/api";

interface UseIncomeOptions {
  page?: number;
  take?: number;
  /** "YYYY-MM" — converted to startDate/endDate for the API */
  month?: string;
}

interface UseIncomeReturn {
  income: Income[];
  meta: PageMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useIncome({ page = 1, take = 20, month }: UseIncomeOptions = {}): UseIncomeReturn {
  const [income, setIncome] = useState<Income[]>([]);
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
        const res = await api.get<PaginatedResponse<Income>>("/v1/income", params);
        if (cancelled) return;
        setIncome(res.items);
        setMeta(res.meta);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, take, month, tick]);

  return {
    income,
    meta,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

interface UsePaginatedIncomeOptions {
  take?: number;
  /** "YYYY-MM" — converted to startDate/endDate for the API */
  month?: string;
}

interface UsePaginatedIncomeReturn {
  income: Income[];
  meta: PageMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => void;
}

/**
 * Accumulates pages as `loadMore` is called (for infinite scroll), unlike
 * `useIncome`, which replaces its result on every fetch. Resets back to
 * page 1 automatically whenever a filter option changes.
 */
export function usePaginatedIncome({ take = 20, month }: UsePaginatedIncomeOptions = {}): UsePaginatedIncomeReturn {
  const [income, setIncome] = useState<Income[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [month]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);
      try {
        const params: Record<string, string | number | boolean> = { page, take };
        if (month) {
          const [y, m] = month.split("-");
          const last = new Date(Number(y), Number(m), 0).getDate();
          params.startDate = `${month}-01`;
          params.endDate = `${month}-${String(last).padStart(2, "0")}`;
        }
        const res = await api.get<PaginatedResponse<Income>>("/v1/income", params);
        if (cancelled) return;
        setIncome((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        setMeta(res.meta);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, take, month]);

  return {
    income,
    meta,
    isLoading,
    isLoadingMore,
    error,
    loadMore: useCallback(() => setPage((p) => p + 1), []),
  };
}

export async function createIncome(dto: CreateIncomeDto): Promise<Income> {
  return api.post<Income>("/v1/income", dto);
}

export async function updateIncome(id: string, dto: UpdateIncomeDto): Promise<Income> {
  return api.patch<Income>(`/v1/income/${id}`, dto);
}

export async function deleteIncome(id: string): Promise<void> {
  return api.delete(`/v1/income/${id}`);
}

export async function getIncome(id: string): Promise<Income> {
  return api.get<Income>(`/v1/income/${id}`);
}
