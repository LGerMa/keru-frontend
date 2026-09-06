"use client";

import { X } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { formatCurrency, formatMonth } from "@/lib/utils";
import type { TagBreakdownTag } from "@/types/dashboard";

interface TagTransactionsModalProps {
  tag: TagBreakdownTag | null;
  month: string;
  onClose: () => void;
}

export function TagTransactionsModal({ tag, month, onClose }: TagTransactionsModalProps) {
  const { expenses, isLoading, error } = useExpenses({
    month,
    tags: tag?.name,
    take: 50,
  });

  if (!tag) return null;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-background rounded-t-2xl lg:rounded-2xl px-5 pt-5 pb-6 shadow-xl">
        {/* drag handle — mobile only */}
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4 lg:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: tag.color }}
            />
            <p className="text-sm font-semibold capitalize truncate">{tag.name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground p-1 -mr-1 flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {formatMonth(month)}
          {!isLoading && !error && (
            <span> · {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"} · {formatCurrency(total)}</span>
          )}
        </p>

        {/* Body */}
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {isLoading && (
            <div className="flex flex-col gap-3 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <p className="text-sm text-destructive py-8 text-center">{error}</p>
          )}

          {!isLoading && !error && expenses.length === 0 && (
            <EmptyState
              title="No transactions"
              description={`Nothing tagged "${tag.name}" in ${formatMonth(month)}.`}
            />
          )}

          {!isLoading && !error && expenses.length > 0 && (
            <div>
              {expenses.map((expense) => (
                <TransactionItem
                  key={expense.id}
                  transaction={{ kind: "expense", ...expense }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
