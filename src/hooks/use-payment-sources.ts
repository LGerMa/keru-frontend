"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  PaymentSource,
  CreatePaymentSourceDto,
  UpdatePaymentSourceDto,
} from "@/types/payment-source";

interface UsePaymentSourcesReturn {
  paymentSources: PaymentSource[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePaymentSources(): UsePaymentSourcesReturn {
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<PaymentSource[]>("/v1/payment-sources");
        if (cancelled) return;
        setPaymentSources(data);
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
    paymentSources,
    isLoading,
    error,
    refetch: useCallback(() => setTick((n) => n + 1), []),
  };
}

export async function createPaymentSource(
  dto: CreatePaymentSourceDto,
): Promise<PaymentSource> {
  return api.post<PaymentSource>("/v1/payment-sources", dto);
}

export async function updatePaymentSource(
  id: string,
  dto: UpdatePaymentSourceDto,
): Promise<PaymentSource> {
  return api.patch<PaymentSource>(`/v1/payment-sources/${id}`, dto);
}

export async function deletePaymentSource(id: string): Promise<void> {
  return api.delete(`/v1/payment-sources/${id}`);
}
