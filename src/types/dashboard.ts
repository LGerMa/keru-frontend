import type { Tag } from "./tag";

export interface DashboardSummary {
  month: string;       // "2026-04"
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface TagBreakdown {
  tag: Tag;
  amount: number;
  percentage: number;
}

export interface MonthTrend {
  month: string;       // "2026-04"
  income: number;
  expenses: number;
}

export interface TagComparison {
  tag: Tag;
  currentMonth: number;
  previousMonth: number;
  change: number;      // percentage change
}
