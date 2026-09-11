"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Expense } from "@/types/expense";
import type { BudgetRuleTransactions, RuleBucketName } from "@/types/dashboard";
import type { PageMeta } from "@/types/api";

interface UseBudgetRuleTransactionsReturn {
  items: Expense[];
  meta: PageMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => void;
}

const TAKE = 10;

/** Paginated expense rows behind a 50/30/20 bucket (needs/wants/savings) for a month. */
export function useBudgetRuleTransactions(
  bucket: RuleBucketName | null,
  month: string
): UseBudgetRuleTransactionsReturn {
  const [items, setItems] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [bucket, month]);

  useEffect(() => {
    if (!bucket) return;
    let cancelled = false;

    async function load() {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      try {
        const data = await api.get<BudgetRuleTransactions>("/v1/dashboard/budget-rule/transactions", {
          bucket: bucket as string,
          month,
          page,
          take: TAKE,
        });
        if (cancelled) return;
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
        setMeta(data.meta);
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
    return () => {
      cancelled = true;
    };
  }, [bucket, month, page]);

  return {
    items,
    meta,
    isLoading,
    isLoadingMore,
    error,
    loadMore: useCallback(() => setPage((p) => p + 1), []),
  };
}
