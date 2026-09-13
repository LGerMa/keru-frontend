"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { BudgetStatus } from "@/types/budget";

interface BudgetOverviewProps {
  statuses: BudgetStatus[];
}

function barColor(pct: number): string {
  if (pct >= 100) return "#EF4444";
  if (pct >= 80) return "#F59E0B";
  return "#22C55E";
}

export function BudgetOverview({ statuses }: BudgetOverviewProps) {
  const t = useTranslations("Dashboard");
  if (statuses.length === 0) return null;

  const totalSpent = statuses.reduce((sum, s) => sum + s.spent, 0);
  const totalBudget = statuses.reduce((sum, s) => sum + s.budget, 0);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">{t("budgets")}</p>
        <Link href="/tags" className="text-xs text-primary font-semibold">
          {t("budgetsManage")}
        </Link>
      </div>
      <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden px-4 py-3 flex flex-col gap-3">
        {statuses.map((s) => {
          const pct = Math.min(s.percentage, 100);
          const color = barColor(s.percentage);
          const isOver = s.percentage >= 100;

          return (
            <div key={s.tag.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.tag.color }}
                  />
                  <span className={`text-xs font-medium ${isOver ? "text-destructive" : "text-foreground"}`}>
                    {s.tag.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(s.spent)}
                  <span className="text-muted-foreground/50"> / </span>
                  {formatCurrency(s.budget)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between pt-1 mt-1 border-t border-border">
          <span className="text-xs font-semibold text-foreground">{t("budgetsTotal")}</span>
          <span className="text-xs font-semibold text-foreground">
            {formatCurrency(totalSpent)}
            <span className="text-muted-foreground/50"> / </span>
            {formatCurrency(totalBudget)}
          </span>
        </div>
      </div>
    </div>
  );
}
