"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  RecurringEntry,
  CreateRecurringDto,
  UpdateRecurringDto,
} from "@/types/recurring";

interface UseRecurringReturn {
  entries: RecurringEntry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecurring(): UseRecurringReturn {
  const [entries, setEntries] = useState<RecurringEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<RecurringEntry[]>("/v1/recurring");
        if (cancelled) return;
        setEntries(data);
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
    entries,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createRecurring(dto: CreateRecurringDto): Promise<RecurringEntry> {
  return api.post<RecurringEntry>("/v1/recurring", dto);
}

export async function updateRecurring(id: string, dto: UpdateRecurringDto): Promise<RecurringEntry> {
  return api.patch<RecurringEntry>(`/v1/recurring/${id}`, dto);
}

export async function deleteRecurring(id: string): Promise<void> {
  return api.delete(`/v1/recurring/${id}`);
}

export async function pauseRecurring(id: string): Promise<RecurringEntry> {
  return api.post<RecurringEntry>(`/v1/recurring/${id}/pause`, {});
}

export async function resumeRecurring(id: string): Promise<RecurringEntry> {
  return api.post<RecurringEntry>(`/v1/recurring/${id}/resume`, {});
}
