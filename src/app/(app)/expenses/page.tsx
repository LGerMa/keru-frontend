"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { currentMonth, formatMonth } from "@/lib/utils";

export default function ExpensesPage() {
  const [month, setMonth] = useState<string>(currentMonth());
  const { expenses, meta, isLoading, error } = useExpenses({ month });

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-semibold">Expenses</h1>
        <Link
          href="/expenses/new"
          className="flex items-center gap-1 text-xs text-primary"
        >
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
                  ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderColor: "hsl(var(--primary))" }
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

      {!isLoading && !error && expenses.length === 0 && (
        <EmptyState
          title="No expenses yet"
          description={`Nothing recorded for ${formatMonth(month)}`}
          action={
            <Link href="/expenses/new" className="text-xs text-primary underline underline-offset-4">
              Add your first expense
            </Link>
          }
        />
      )}

      {!isLoading && expenses.length > 0 && (
        <div>
          {expenses.map((expense) => (
            <TransactionItem
              key={expense.id}
              transaction={{ kind: "expense", ...expense }}
            />
          ))}
          {meta && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              {meta.itemCount} expense{meta.itemCount !== 1 ? "s" : ""} this month
            </p>
          )}
        </div>
      )}
    </div>
  );
}
