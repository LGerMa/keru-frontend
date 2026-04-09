import { formatCurrency, formatMonth } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";

interface BalanceCardProps {
  summary: DashboardSummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <div className="gradient-hero rounded-3xl p-6 mb-5 shadow-hero">
      <p className="text-xs text-white/60 uppercase tracking-widest font-medium mb-2">
        {formatMonth(summary.month)}
      </p>
      <p className="text-4xl font-extrabold text-white tracking-tight" style={{ letterSpacing: "-1.5px" }}>
        {formatCurrency(summary.balance)}
      </p>
      <div className="flex gap-6 mt-4">
        <div>
          <p className="text-xs text-white/50 mb-0.5">↑ Income</p>
          <p className="text-sm font-bold text-emerald-300">{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-0.5">↓ Expenses</p>
          <p className="text-sm font-bold text-white/80">{formatCurrency(summary.totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
}
