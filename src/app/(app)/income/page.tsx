"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useIncome } from "@/hooks/use-income";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { currentMonth, formatMonth } from "@/lib/utils";

export default function IncomePage() {
  const [month, setMonth] = useState<string>(currentMonth());
  const { income, meta, isLoading, error } = useIncome({ month });

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-semibold">Income</h1>
        <Link href="/income/new" className="flex items-center gap-1 text-xs text-primary">
          <Plus size={14} />
          Add
        </Link>
      </div>

      {/* Month picker */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          return (
            <button
              key={m}
              onClick={() => setMonth(m)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={
                month === m
                  ? { backgroundColor: "#22C55E", color: "#fff", borderColor: "#22C55E" }
                  : {}
              }
            >
              {formatMonth(m).split(" ")[0]}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && income.length === 0 && (
        <EmptyState
          title="No income yet"
          description={`Nothing recorded for ${formatMonth(month)}`}
          action={
            <Link href="/income/new" className="text-xs text-primary underline underline-offset-4">
              Add your first income
            </Link>
          }
        />
      )}

      {!isLoading && income.length > 0 && (
        <div>
          {income.map((entry) => (
            <TransactionItem
              key={entry.id}
              transaction={{ kind: "income", ...entry }}
            />
          ))}
          {meta && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              {meta.itemCount} entr{meta.itemCount !== 1 ? "ies" : "y"} this month
            </p>
          )}
        </div>
      )}
    </div>
  );
}
