import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary, TagBreakdown } from "@/types/dashboard";

interface QuickStatsProps {
  summary: DashboardSummary;
  tagBreakdowns: TagBreakdown[];
  expenseCount: number;
  daysIntoMonth: number;
}

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}

function StatCard({ label, value, sub, valueColor = "var(--foreground)" }: StatCardProps) {
  return (
    <div className="bg-card rounded-[18px] border border-border shadow-card-sm p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </p>
      <p
        className="text-xl font-extrabold leading-none tracking-tight font-tabular"
        style={{ color: valueColor, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
    </div>
  );
}

export function QuickStats({
  summary,
  tagBreakdowns,
  expenseCount,
  daysIntoMonth,
}: QuickStatsProps) {
  // Daily average (expenses only, based on days into the current month)
  const dailyAvg =
    daysIntoMonth > 0 ? summary.totalExpenses / daysIntoMonth : 0;

  // Top category by amount
  const sorted = [...tagBreakdowns].sort((a, b) => b.total - a.total);
  const topTag = sorted[0];

  // Transaction total
  const totalTx = summary.expenseCount + summary.incomeCount;

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <StatCard
        label="Daily avg"
        value={formatCurrency(dailyAvg)}
        sub={`${daysIntoMonth} day${daysIntoMonth !== 1 ? "s" : ""} in`}
      />
      <StatCard
        label="Expenses"
        value={String(expenseCount)}
        sub="transactions this month"
        valueColor="var(--primary)"
      />
      <StatCard
        label="Top category"
        value={topTag?.tag.name ?? "—"}
        sub={topTag ? formatCurrency(topTag.total) + " spent" : "no data"}
        valueColor={topTag?.tag.color ?? "var(--foreground)"}
      />
      <StatCard
        label="All transactions"
        value={String(totalTx)}
        sub={`${summary.incomeCount} income · ${summary.expenseCount} expenses`}
      />
    </div>
  );
}
