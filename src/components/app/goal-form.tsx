"use client";

import { useTranslations } from "next-intl";
import type { GoalType } from "@/types/goal";

export interface GoalFormState {
  name: string;
  goalType: GoalType;
  targetAmount: string;
  initialAmount: string;
  targetDate: string;
}

export const DEFAULT_GOAL_FORM: GoalFormState = {
  name: "",
  goalType: "saving",
  targetAmount: "",
  initialAmount: "",
  targetDate: "",
};

const GOAL_TYPES: { value: GoalType; labelKey: "typeSaving" | "typeDebt" | "typeInvestment" }[] = [
  { value: "saving", labelKey: "typeSaving" },
  { value: "debt", labelKey: "typeDebt" },
  { value: "investment", labelKey: "typeInvestment" },
];

interface GoalFormProps {
  form: GoalFormState;
  onChange: (form: GoalFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function GoalForm({ form, onChange, onSubmit, onCancel, isSubmitting, submitLabel }: GoalFormProps) {
  const t = useTranslations("Goals");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">{t("name")}</label>
        <input
          type="text"
          placeholder={t("namePlaceholder")}
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          maxLength={100}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">{t("type")}</label>
        <div className="flex gap-2 flex-wrap">
          {GOAL_TYPES.map(({ value, labelKey }) => {
            const selected = form.goalType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...form, goalType: value })}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={
                  selected
                    ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                    : {}
                }
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">{t("targetAmount")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.targetAmount}
            onChange={(e) => onChange({ ...form, targetAmount: e.target.value })}
            className="w-full border rounded-xl pl-7 pr-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">{t("startingBalance")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.initialAmount}
            onChange={(e) => onChange({ ...form, initialAmount: e.target.value })}
            className="w-full border rounded-xl pl-7 pr-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">{t("targetDate")}</label>
        <input
          type="date"
          value={form.targetDate}
          onChange={(e) => onChange({ ...form, targetDate: e.target.value })}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-xl py-3 text-sm font-medium"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? t("saving") : submitLabel}
        </button>
      </div>
    </form>
  );
}
