import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency, formatMonth } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

interface BalanceCardProps {
  summary: DashboardSummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <div className="mb-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {formatMonth(summary.month)}
      </p>
      <p className="text-3xl font-medium">
        {formatCurrency(summary.balance)}
      </p>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1 text-sm text-[#22C55E]">
          <ArrowUp size={14} />
          {formatCurrency(summary.totalIncome)}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowDown size={14} />
          {formatCurrency(summary.totalExpenses)}
        </span>
      </div>
    </div>
  );
}
