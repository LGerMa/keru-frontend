"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/app/tag-badge";
import type { Expense } from "@/types/expense";

type SortKey = "date" | "description" | "tag" | "method" | "amount";
type SortDir = "asc" | "desc";

interface TransactionsTableProps {
  expenses: Expense[];
  pageSize?: number;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return (
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="opacity-35"
      >
        <polyline points="8 9 12 5 16 9" />
        <polyline points="8 15 12 19 16 15" />
      </svg>
    );
  }
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      {dir === "asc" ? (
        <polyline points="6 14 12 8 18 14" />
      ) : (
        <polyline points="6 10 12 16 18 10" />
      )}
    </svg>
  );
}

export function TransactionsTable({
  expenses,
  pageSize = 8,
}: TransactionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "amount" || key === "date" ? "desc" : "asc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let av: string | number;
      let bv: string | number;

      switch (sortKey) {
        case "date":
          av = a.date;
          bv = b.date;
          break;
        case "description":
          av = (a.description ?? "").toLowerCase();
          bv = (b.description ?? "").toLowerCase();
          break;
        case "tag":
          av = a.tags[0]?.name ?? "";
          bv = b.tags[0]?.name ?? "";
          break;
        case "method":
          av = a.paymentMethod;
          bv = b.paymentMethod;
          break;
        case "amount":
          av = a.amount;
          bv = b.amount;
          break;
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [expenses, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const thClass =
    "text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border cursor-pointer select-none whitespace-nowrap hover:text-foreground transition-colors";
  const thActiveClass = "text-primary";
  const tdClass = "px-4 py-3 border-b border-border text-sm";

  function Th({
    k,
    children,
    right,
  }: {
    k: SortKey;
    children: React.ReactNode;
    right?: boolean;
  }) {
    const active = k === sortKey;
    return (
      <th
        className={`${thClass} ${active ? thActiveClass : ""}`}
        style={{ textAlign: right ? "right" : "left" }}
        onClick={() => handleSort(k)}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          <SortIcon active={active} dir={sortDir} />
        </span>
      </th>
    );
  }

  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No transactions this month.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th k="date">Date</Th>
              <Th k="description">Description</Th>
              <Th k="tag">Category</Th>
              <Th k="method">Method</Th>
              <Th k="amount" right>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((expense) => {
              const primaryTag = expense.tags[0];
              const description = expense.description ?? "Expense";
              const tagColor = primaryTag?.color ?? "#6366f1";
              const tagName = primaryTag?.name ?? "other";

              return (
                <tr
                  key={expense.id}
                  className="hover:bg-muted/40 transition-colors group"
                >
                  <td className={`${tdClass} text-muted-foreground tabular-nums whitespace-nowrap`}>
                    {formatDate(expense.date, { month: "short", day: "numeric" })}
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/expenses/${expense.id}`}
                      className="flex items-center gap-2.5 group-hover:text-primary transition-colors"
                    >
                      <TagBadge color={tagColor} name={tagName} size={30} />
                      <span className="font-medium truncate max-w-[200px]">
                        {description}
                      </span>
                    </Link>
                  </td>
                  <td className={tdClass}>
                    {primaryTag ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          background: primaryTag.color + "18",
                          color: primaryTag.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: primaryTag.color }}
                        />
                        {primaryTag.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className={`${tdClass} text-muted-foreground whitespace-nowrap capitalize`}>
                    {expense.paymentMethod.replace("_", " ")}
                  </td>
                  <td
                    className={`${tdClass} text-right font-bold tabular-nums whitespace-nowrap text-foreground`}
                  >
                    -{formatCurrency(expense.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
          <span>
            {page * pageSize + 1}–
            {Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <button
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
