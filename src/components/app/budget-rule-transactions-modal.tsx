"use client";

import { X } from "lucide-react";
import { useBudgetRuleTransactions } from "@/hooks/use-budget-rule-transactions";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { formatCurrency, formatMonth } from "@/lib/utils";
import type { BudgetRuleBucket } from "@/types/dashboard";

interface BudgetRuleTransactionsModalProps {
  bucket: BudgetRuleBucket | null;
  month: string;
  onClose: () => void;
}

const BUCKET_LABEL: Record<string, string> = {
  needs: "Needs",
  wants: "Wants",
  savings: "Savings",
};

export function BudgetRuleTransactionsModal({ bucket, month, onClose }: BudgetRuleTransactionsModalProps) {
  const { items, meta, isLoading, isLoadingMore, error, loadMore } = useBudgetRuleTransactions(
    bucket?.bucket ?? null,
    month
  );

  if (!bucket) return null;

  const label = BUCKET_LABEL[bucket.bucket] ?? bucket.bucket;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-background rounded-t-2xl lg:rounded-2xl px-5 pt-5 pb-6 shadow-xl">
        {/* drag handle — mobile only */}
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4 lg:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold">
            {label} <span className="text-muted-foreground font-normal">· {bucket.targetPct}% target</span>
          </p>
          <button onClick={onClose} className="text-muted-foreground p-1 -mr-1 flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {formatMonth(month)}
          <span> · {formatCurrency(bucket.spent)} / {formatCurrency(bucket.target)} ({bucket.percentage}%)</span>
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

          {!isLoading && !error && items.length === 0 && (
            <EmptyState
              title="No transactions"
              description={`Nothing in the ${label.toLowerCase()} bucket in ${formatMonth(month)}.`}
            />
          )}

          {!isLoading && !error && items.length > 0 && (
            <div>
              {bucket.bucket === "savings" && (
                <p className="text-xs text-muted-foreground py-2">
                  Saving contributions count toward the target; unplanned expenses (in red) reduce it.
                </p>
              )}
              {items.map((expense) => (
                <TransactionItem
                  key={expense.id}
                  transaction={{ kind: "expense", ...expense }}
                  deduction={bucket.bucket === "savings" && expense.type === "unplanned"}
                />
              ))}
              {meta?.hasNextPage && (
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="w-full text-xs font-semibold text-primary py-3 disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading…" : "Load more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
