"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Goal, GoalWithProgress, CreateGoalDto, UpdateGoalDto } from "@/types/goal";

interface UseGoalsReturn {
  goals: GoalWithProgress[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<GoalWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<GoalWithProgress[]>("/v1/goals");
        if (cancelled) return;
        setGoals(data);
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
    goals,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

interface UseGoalReturn {
  goal: GoalWithProgress | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGoal(id: string): UseGoalReturn {
  const [goal, setGoal] = useState<GoalWithProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await api.get<GoalWithProgress>(`/v1/goals/${id}`);
        if (cancelled) return;
        setGoal(data);
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
  }, [id, tick]);

  return {
    goal,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createGoal(dto: CreateGoalDto): Promise<Goal> {
  return api.post<Goal>("/v1/goals", dto);
}

export async function updateGoal(id: string, dto: UpdateGoalDto): Promise<Goal> {
  return api.patch<Goal>(`/v1/goals/${id}`, dto);
}

export async function deleteGoal(id: string): Promise<void> {
  return api.delete(`/v1/goals/${id}`);
}
