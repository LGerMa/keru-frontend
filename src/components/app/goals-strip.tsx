import Link from "next/link";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { GoalProgressBar } from "@/components/app/goal-progress-bar";
import type { GoalType, GoalWithProgress } from "@/types/goal";

interface GoalsStripProps {
  goals: GoalWithProgress[];
}

const GOAL_TYPE_ICON: Record<GoalType, typeof PiggyBank> = {
  saving: PiggyBank,
  debt: TrendingDown,
  investment: TrendingUp,
};

export function GoalsStrip({ goals }: GoalsStripProps) {
  const visible = goals.filter((g) => g.status !== "abandoned");
  if (visible.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
      {visible.map((goal) => {
        const Icon = GOAL_TYPE_ICON[goal.goalType];
        return (
          <Link
            key={goal.id}
            href={`/goals/${goal.id}`}
            className="flex-shrink-0 rounded-xl p-3 w-[160px] active:opacity-70 transition-opacity shadow-card-sm bg-primary/10"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={13} className="text-primary flex-shrink-0" />
              <p className="text-xs font-semibold truncate">{goal.name}</p>
            </div>
            <GoalProgressBar
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
              percentage={goal.percentage}
              compact
            />
          </Link>
        );
      })}
    </div>
  );
}
