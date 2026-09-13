"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { BudgetRule, RuleBucketName, RuleStatusLevel } from "@/types/dashboard";

interface BudgetRuleCardProps {
  rule: BudgetRule;
  onSelectBucket?: (bucket: RuleBucketName) => void;
}

const STATUS_COLOR: Record<RuleStatusLevel, string> = {
  normal: "#22C55E",
  warning: "#F59E0B",
  over: "#EF4444",
};

export function BudgetRuleCard({ rule, onSelectBucket }: BudgetRuleCardProps) {
  const t = useTranslations("Dashboard");
  const BUCKET_LABEL: Record<string, string> = {
    needs: t("bucketNeeds"),
    wants: t("bucketWants"),
    savings: t("bucketSavings"),
  };

  if (rule.income === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {t("noIncomeRecorded")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rule.rule.map((b) => {
        const fill = Math.max(0, Math.min(b.percentage, 100));
        const color = STATUS_COLOR[b.status];

        const Wrapper = onSelectBucket ? "button" : "div";

        return (
          <Wrapper
            key={b.bucket}
            type={onSelectBucket ? "button" : undefined}
            onClick={onSelectBucket ? () => onSelectBucket(b.bucket) : undefined}
            className={onSelectBucket ? "text-left -mx-1 px-1 py-0.5 rounded-lg hover:bg-muted/50 transition-colors" : undefined}
          >
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
          </Wrapper>
        );
      })}
    </div>
  );
}
