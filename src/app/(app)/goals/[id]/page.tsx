"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useGoal, updateGoal, deleteGoal } from "@/hooks/use-goals";
import { useExpenses } from "@/hooks/use-expenses";
import { GoalForm, DEFAULT_GOAL_FORM, type GoalFormState } from "@/components/app/goal-form";
import { GoalProgressBar } from "@/components/app/goal-progress-bar";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { formatDate } from "@/lib/utils";

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("Goals");
  const locale = useLocale();
  const router = useRouter();
  const { goal, isLoading, error, refetch } = useGoal(id);
  // API caps `take` at 50 (backend ValidationPipe rejects higher values). There's no
  // server-side `?goalId=` filter, so an expense linked beyond the 50 most recent won't show here.
  const { expenses, isLoading: expensesLoading, error: expensesError } = useExpenses({ take: 50 });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<GoalFormState>(DEFAULT_GOAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function openEdit() {
    if (!goal) return;
    setEditForm({
      name: goal.name,
      goalType: goal.goalType,
      targetAmount: String(goal.targetAmount),
      initialAmount: goal.initialAmount ? String(goal.initialAmount) : "",
      targetDate: goal.targetDate ?? "",
    });
    setIsEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    if (!editForm.name.trim()) {
      toast.error(t("nameRequired"));
      return;
    }
    const target = parseFloat(editForm.targetAmount);
    if (isNaN(target) || target <= 0) {
      toast.error(t("invalidTargetAmount"));
      return;
    }
    // The backend's PATCH /goals/:id has no documented way to clear targetDate — omitting
    // the field just leaves it unchanged (unlike expenses' goalId, which the API docs
    // explicitly say can be cleared with `null`). Block the clear instead of silently
    // no-op'ing while showing a false "updated" success toast.
    if (goal.targetDate && !editForm.targetDate) {
      toast.error(t("cannotClearTargetDate"));
      return;
    }
    const wasCompleted = goal.status === "completed";
    setIsSaving(true);
    try {
      const updated = await updateGoal(id, {
        name: editForm.name.trim(),
        goalType: editForm.goalType,
        targetAmount: target,
        initialAmount: editForm.initialAmount ? parseFloat(editForm.initialAmount) : 0,
        targetDate: editForm.targetDate || undefined,
      });
      refetch();
      setIsEditing(false);
      toast.success(t("updated"));
      if (wasCompleted && updated.status !== "completed") {
        toast.success(t("reopened"));
      }
    } catch (err) {
      toast.error((err as Error).message ?? t("somethingWentWrong"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteGoal(id);
      toast.success(t("deleted"));
      router.push("/goals");
    } catch (err) {
      toast.error((err as Error).message ?? t("deleteFailed"));
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (isLoading) {
    return (
      <div className="pt-6 flex justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="pt-6">
        <Link href="/goals" className="text-muted-foreground inline-flex items-center gap-1 mb-4">
          <ChevronLeft size={20} />
        </Link>
        <p className="text-sm text-destructive">{error ?? t("notFound")}</p>
      </div>
    );
  }

  const linkedExpenses = expenses.filter((e) => e.goalId === goal.id);
  const statusLabel = t(`status${goal.status.charAt(0).toUpperCase()}${goal.status.slice(1)}` as "statusActive" | "statusCompleted" | "statusAbandoned");

  return (
    <div className="pt-6 pb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link href="/goals" className="text-muted-foreground">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold tracking-tight truncate">{goal.name}</h1>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-3">
            <button onClick={openEdit} className="text-muted-foreground" aria-label={t("edit")}>
              <Pencil size={18} />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="text-destructive" aria-label={t("delete")}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <GoalForm
          form={editForm}
          onChange={setEditForm}
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
          isSubmitting={isSaving}
          submitLabel={t("save")}
        />
      ) : (
        <>
          <div className="bg-card rounded-2xl shadow-card-md border border-border p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={
                  goal.status === "completed"
                    ? { backgroundColor: "rgba(34, 197, 94, 0.12)", color: "#22C55E" }
                    : goal.status === "abandoned"
                      ? { backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#EF4444" }
                      : { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }
                }
              >
                {statusLabel}
              </span>
              {goal.targetDate && (
                <span className="text-xs text-muted-foreground">
                  {t("targetDateLabel", { date: formatDate(goal.targetDate, undefined, locale) })}
                </span>
              )}
            </div>
            <GoalProgressBar
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
              percentage={goal.percentage}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            {t("linkedExpenses")}
          </p>

          {expensesLoading && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}

          {!expensesLoading && expensesError && (
            <p className="text-sm text-destructive">{expensesError}</p>
          )}

          {!expensesLoading && !expensesError && linkedExpenses.length === 0 && (
            <EmptyState title={t("noLinkedExpenses")} />
          )}

          {!expensesLoading && !expensesError && linkedExpenses.length > 0 && (
            <div className="bg-card rounded-2xl shadow-card-md overflow-hidden px-1">
              {linkedExpenses.map((expense) => (
                <TransactionItem key={expense.id} transaction={{ kind: "expense", ...expense }} />
              ))}
            </div>
          )}
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md bg-background rounded-t-2xl lg:rounded-2xl px-5 pt-5 pb-10 lg:pb-6 shadow-xl">
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4 lg:hidden" />
            <p className="text-sm font-semibold mb-2">{t("confirmDeleteTitle")}</p>
            <p className="text-xs text-muted-foreground mb-5">{t("confirmDeleteBody")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border rounded-xl py-3 text-sm font-medium"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-destructive text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? t("saving") : t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
