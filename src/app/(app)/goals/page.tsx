"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGoals, createGoal } from "@/hooks/use-goals";
import { GoalForm, DEFAULT_GOAL_FORM, type GoalFormState } from "@/components/app/goal-form";
import { GoalProgressBar } from "@/components/app/goal-progress-bar";
import { EmptyState } from "@/components/app/empty-state";
import type { GoalType, GoalStatus, GoalWithProgress } from "@/types/goal";

const GOAL_TYPE_ICON: Record<GoalType, typeof PiggyBank> = {
  saving: PiggyBank,
  debt: TrendingDown,
  investment: TrendingUp,
};

const STATUS_STYLE: Record<GoalStatus, { bg: string; fg: string }> = {
  active: { bg: "var(--muted)", fg: "var(--muted-foreground)" },
  completed: { bg: "rgba(34, 197, 94, 0.12)", fg: "#22C55E" },
  abandoned: { bg: "rgba(239, 68, 68, 0.12)", fg: "#EF4444" },
};

export default function GoalsPage() {
  const t = useTranslations("Goals");
  const { goals, isLoading, error, refetch } = useGoals();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<GoalFormState>(DEFAULT_GOAL_FORM);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error(t("nameRequired"));
      return;
    }
    const target = parseFloat(createForm.targetAmount);
    if (isNaN(target) || target <= 0) {
      toast.error(t("invalidTargetAmount"));
      return;
    }
    setIsCreating(true);
    try {
      await createGoal({
        name: createForm.name.trim(),
        goalType: createForm.goalType,
        targetAmount: target,
        initialAmount: createForm.initialAmount ? parseFloat(createForm.initialAmount) : undefined,
        targetDate: createForm.targetDate || undefined,
      });
      refetch();
      setShowCreate(false);
      setCreateForm(DEFAULT_GOAL_FORM);
      toast.success(t("created"));
    } catch (err) {
      toast.error((err as Error).message ?? t("somethingWentWrong"));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">{t("title")}</h1>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(DEFAULT_GOAL_FORM); }}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <Plus size={14} />
          {t("new")}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && goals.length === 0 && (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="text-xs text-primary underline underline-offset-4"
            >
              {t("emptyAction")}
            </button>
          }
        />
      )}

      {!isLoading && goals.length > 0 && (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {showCreate && (
        <Dialog title={t("newGoalDialogTitle")} onClose={() => setShowCreate(false)}>
          <GoalForm
            form={createForm}
            onChange={setCreateForm}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isSubmitting={isCreating}
            submitLabel={t("create")}
          />
        </Dialog>
      )}
    </div>
  );
}

function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const t = useTranslations("Goals");
  const Icon = GOAL_TYPE_ICON[goal.goalType];
  const statusStyle = STATUS_STYLE[goal.status];
  const statusLabel = t(`status${goal.status.charAt(0).toUpperCase()}${goal.status.slice(1)}` as "statusActive" | "statusCompleted" | "statusAbandoned");

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="bg-card rounded-2xl shadow-card-sm border border-border px-4 py-3.5 flex flex-col gap-3 hover:shadow-card-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
            <Icon size={15} />
          </div>
          <p className="text-sm font-semibold truncate">{goal.name}</p>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.fg }}
        >
          {statusLabel}
        </span>
      </div>

      <GoalProgressBar
        currentAmount={goal.currentAmount}
        targetAmount={goal.targetAmount}
        percentage={goal.percentage}
      />
    </Link>
  );
}

function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-t-2xl lg:rounded-2xl px-5 pt-5 pb-10 lg:pb-6 shadow-xl">
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4 lg:hidden" />
        <p className="text-sm font-semibold mb-5">{title}</p>
        {children}
      </div>
    </div>
  );
}
