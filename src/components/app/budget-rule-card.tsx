import { formatCurrency } from "@/lib/utils";
import type { BudgetRule, RuleStatusLevel } from "@/types/dashboard";

interface BudgetRuleCardProps {
  rule: BudgetRule;
}

const STATUS_COLOR: Record<RuleStatusLevel, string> = {
  normal: "#22C55E",
  warning: "#F59E0B",
  over: "#EF4444",
};

const BUCKET_LABEL: Record<string, string> = {
  needs: "Needs",
  wants: "Wants",
  savings: "Savings",
};

export function BudgetRuleCard({ rule }: BudgetRuleCardProps) {
  if (rule.income === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No income recorded this month.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rule.rule.map((b) => {
        const fill = Math.max(0, Math.min(b.percentage, 100));
        const color = STATUS_COLOR[b.status];

        return (
          <div key={b.bucket}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">
                {BUCKET_LABEL[b.bucket] ?? b.bucket}
                <span className="text-muted-foreground/70 font-normal"> · {b.targetPct}%</span>
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(b.spent)}
                <span className="text-muted-foreground/50"> / </span>
                {formatCurrency(b.target)}
                <span className="text-muted-foreground/70"> ({b.percentage}%)</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${fill}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
