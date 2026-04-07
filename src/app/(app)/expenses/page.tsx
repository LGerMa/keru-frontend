"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncome } from "@/hooks/use-income";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { currentMonth, formatMonth } from "@/lib/utils";

type Tab = "expenses" | "income";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("expenses");
  const [month, setMonth] = useState<string>(currentMonth());

  const { expenses, meta: expMeta, isLoading: expLoading, error: expError } =
    useExpenses({ month });
  const { income, meta: incMeta, isLoading: incLoading, error: incError } =
    useIncome({ month });

  const isLoading = tab === "expenses" ? expLoading : incLoading;
  const error = tab === "expenses" ? expError : incError;
  const items = tab === "expenses" ? expenses : income;
  const meta = tab === "expenses" ? expMeta : incMeta;
  const addHref = tab === "expenses" ? "/expenses/new" : "/income/new";
  const addLabel = tab === "expenses" ? "Add expense" : "Add income";
  const emptyTitle = tab === "expenses" ? "No expenses yet" : "No income yet";
  const countLabel =
    tab === "expenses"
      ? `${meta?.itemCount ?? 0} expense${meta?.itemCount !== 1 ? "s" : ""} this month`
      : `${meta?.itemCount ?? 0} entr${meta?.itemCount !== 1 ? "ies" : "y"} this month`;

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-semibold">History</h1>
        <Link href={addHref} className="flex items-center gap-1 text-xs text-primary">
          <Plus size={14} />
          {addLabel}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-muted rounded-xl p-1">
        {(["expenses", "income"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize"
            style={
              tab === t
                ? { backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }
                : { color: "hsl(var(--muted-foreground))" }
            }
          >
            {t === "expenses" ? "Expenses" : "Income"}
          </button>
        ))}
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
                  ? {
                      backgroundColor: tab === "income" ? "#22C55E" : "hsl(var(--primary))",
                      color: "#fff",
                      borderColor: tab === "income" ? "#22C55E" : "hsl(var(--primary))",
                    }
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

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title={emptyTitle}
          description={`Nothing recorded for ${formatMonth(month)}`}
          action={
            <Link href={addHref} className="text-xs text-primary underline underline-offset-4">
              Add now
            </Link>
          }
        />
      )}

      {!isLoading && items.length > 0 && (
        <div>
          {tab === "expenses"
            ? expenses.map((e) => (
                <TransactionItem key={e.id} transaction={{ kind: "expense", ...e }} />
              ))
            : income.map((e) => (
                <TransactionItem key={e.id} transaction={{ kind: "income", ...e }} />
              ))}
          {meta && (
            <p className="text-xs text-muted-foreground text-center mt-4">{countLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
