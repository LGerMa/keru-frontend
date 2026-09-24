import { formatCurrency } from "@/lib/utils";

interface GoalProgressBarProps {
  currentAmount: number;
  targetAmount: number;
  percentage: number;
  /** Compact mode omits the amount line, used on list cards. */
  compact?: boolean;
}

function barColor(pct: number): string {
  if (pct >= 100) return "#22C55E";
  if (pct >= 75) return "#F59E0B";
  return "#6366f1";
}

export function GoalProgressBar({ currentAmount, targetAmount, percentage, compact = false }: GoalProgressBarProps) {
  const pct = Math.min(Math.max(percentage, 0), 100);
  const color = barColor(percentage);

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">
            {formatCurrency(currentAmount)}
            <span className="text-muted-foreground/50"> / </span>
            {formatCurrency(targetAmount)}
          </span>
          <span className="text-xs font-semibold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {compact && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">
            {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
          </span>
          <span className="text-[10px] font-semibold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
