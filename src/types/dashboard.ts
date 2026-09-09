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

// ── 50/30/20 budget rule ──────────────────────────────────────────
export type RuleBucketName = "needs" | "wants" | "savings";
export type RuleStatusLevel = "normal" | "warning" | "over";

export interface BudgetRuleBreakdown {
  fixed: number;
  variable: number;
  unplanned: number;
  planned: number;
  saving: number;
}

export interface BudgetRuleBucket {
  bucket: RuleBucketName;
  /** needs = fixed+variable, wants = planned, savings = saving − unplanned (can be negative). */
  spent: number;
  target: number;      // targetPct% of income, rounded
  targetPct: number;   // 50 | 30 | 20
  /** round(spent / target * 100); 0 when income is 0; can be negative for savings. */
  percentage: number;
  status: RuleStatusLevel;
}

export interface BudgetRule {
  month: string;                   // "YYYY-MM"
  income: number;
  breakdown: BudgetRuleBreakdown;
  rule: BudgetRuleBucket[];        // always [needs, wants, savings] in that order
}
