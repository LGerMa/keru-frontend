"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SearchResults } from "@/types/search";

const EMPTY: SearchResults = { expenses: [], income: [], tags: [] };
const DEBOUNCE_MS = 250;

interface UseSearchReturn {
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
}

export function useSearch(query: string, limit = 5): UseSearchReturn {
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(EMPTY);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await api.get<SearchResults>("/v1/search", { q: trimmed, limit });
        if (cancelled) return;
        setResults(data);
        setError(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, limit]);

  return { results, isLoading, error };
}
