"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MonthTrend } from "@/types/dashboard";

interface TrendsChartProps {
  trends: MonthTrend[];
}

function shortMonth(month: string): string {
  const [year, m] = month.split("-");
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(Number(year), Number(m) - 1)
  );
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const data = trends.map((t) => ({
    month: shortMonth(t.month),
    income: t.totalIncome,
    expenses: t.totalExpenses,
  }));

  return (
    <div className="mb-5">
      <p className="text-sm font-medium mb-3">Spending trend</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Bar dataKey="income" fill="#22C55E" radius={[3, 3, 0, 0]} />
          <Bar dataKey="expenses" fill="#3B82F6" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
