export interface DashboardSummary {
  month: string;         // "2026-04"
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expenseCount: number;
  incomeCount: number;
}

export interface TagBreakdownTag {
  id: string;
  name: string;
  color: string;
}

export interface TagBreakdown {
  tag: TagBreakdownTag;
  untagged: boolean;
  total: number;
  count: number;
}

export interface MonthTrend {
  month: string;         // "2026-04"
  totalIncome: number;
  totalExpenses: number;
}

export interface CompareTagMonth {
  month: string;
  total: number;
}

export interface CompareTagItem {
  tag: TagBreakdownTag;
  months: CompareTagMonth[];
  average: number;
  trend: "up" | "down" | "stable";
}

export interface TagComparison {
  period: { from: string; to: string };
  tags: CompareTagItem[];
}
