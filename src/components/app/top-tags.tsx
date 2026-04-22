import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { TagBreakdown } from "@/types/dashboard";
import type { BudgetStatus } from "@/types/budget";

interface TopTagsProps {
  breakdowns: TagBreakdown[];
  budgetStatuses?: BudgetStatus[];
}

export function TopTags({ breakdowns, budgetStatuses }: TopTagsProps) {
  if (breakdowns.length === 0) return null;

  const tagged = breakdowns.filter((b) => !b.untagged);
  const grandTotal = tagged.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Top tags</p>
        <Link href="/tags" className="text-xs text-primary font-semibold">
          See all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {tagged.map(({ tag, total }) => {
          const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
          const budgetStatus = budgetStatuses?.find((s) => s.tag.id === tag.id);
          const isNearBudget = budgetStatus && budgetStatus.percentage >= 90 && budgetStatus.percentage < 100;
          const isOverBudget = budgetStatus && budgetStatus.percentage >= 100;
          return (
            <Link
              key={tag.id}
              href={`/expenses?tag=${encodeURIComponent(tag.name)}`}
              className="relative flex-shrink-0 rounded-xl p-3 min-w-[90px] active:opacity-70 transition-opacity shadow-card-sm"
              style={{ backgroundColor: `${tag.color}18` }}
            >
              {isOverBudget && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
              )}
              {isNearBudget && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
              )}
              <p className="text-xs font-semibold" style={{ color: tag.color }}>
                {tag.name}
              </p>
              <p className="text-sm font-bold mt-1 text-foreground">
                {formatCurrency(total)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pct.toFixed(0)}%
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
