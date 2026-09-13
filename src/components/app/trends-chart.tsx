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
import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { MonthTrend } from "@/types/dashboard";

interface TrendsChartProps {
  trends: MonthTrend[];
}

function shortMonth(month: string, locale: string): string {
  const [year, m] = month.split("-");
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(
    new Date(Number(year), Number(m) - 1)
  );
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const data = trends.map((trend) => ({
    month: shortMonth(trend.month, locale),
    income: trend.totalIncome,
    expenses: trend.totalExpenses,
  }));

  return (
    <div className="mb-5 bg-card rounded-2xl shadow-card-md p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{t("spendingTrends")}</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(99,102,241,0.1)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "oklch(0.558 0.042 277)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{
              fontSize: 12,
              borderRadius: 10,
              border: "1px solid oklch(0.928 0.028 277)",
              boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
            }}
          />
          <Bar dataKey="income" name={t("legendIncome")} fill="#22C55E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name={t("legendExpenses")} fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
