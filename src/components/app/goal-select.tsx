"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useGoals } from "@/hooks/use-goals";
import type { GoalType } from "@/types/goal";

interface GoalSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GOAL_TYPE_COLOR: Record<GoalType, string> = {
  saving: "#6366f1",
  debt: "#EF4444",
  investment: "#22C55E",
};

export function GoalSelect({ value, onChange }: GoalSelectProps) {
  const t = useTranslations("Common");
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("goalOptional")}</p>
        <div className="h-8 rounded-full bg-muted animate-pulse w-40" />
      </div>
    );
  }

  // Only offer active goals as new links, but keep an already-linked goal's pill visible
  // (selected) even if it has since completed/been abandoned, so the form doesn't silently
  // look like "None" while still holding a stale goalId.
  const selectableGoals = goals.filter((g) => g.status === "active" || g.id === value);

  if (selectableGoals.length === 0) {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("goalOptional")}</p>
        <Link href="/goals" className="text-xs text-primary font-semibold underline underline-offset-4">
          {t("addGoal")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("goalOptional")}</p>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onChange("")}
          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
          style={
            value === ""
              ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
              : {}
          }
        >
          {t("none")}
        </button>
        {selectableGoals.map((g) => {
          const selected = value === g.id;
          const color = GOAL_TYPE_COLOR[g.goalType];
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange(g.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={
                selected
                  ? { backgroundColor: `${color}20`, color, borderColor: color }
                  : {}
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {g.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
