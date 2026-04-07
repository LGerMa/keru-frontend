"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Tag, CreateTagDto, UpdateTagDto } from "@/types/tag";

interface UseTagsReturn {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<Tag[]>("/v1/tags");
        if (cancelled) return;
        setTags(data);
        setError(null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return {
    tags,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createTag(dto: CreateTagDto): Promise<Tag> {
  return api.post<Tag>("/v1/tags", dto);
}

export async function updateTag(id: string, dto: UpdateTagDto): Promise<Tag> {
  return api.patch<Tag>(`/v1/tags/${id}`, dto);
}

export async function deleteTag(id: string): Promise<void> {
  return api.delete(`/v1/tags/${id}`);
}
