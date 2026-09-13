import { useTranslations } from "next-intl";
import { EXPENSE_TYPES } from "@/lib/constants";
import type { ExpenseType } from "@/lib/constants";

interface ExpenseTypeSelectProps {
  value: ExpenseType | "";
  onChange: (value: ExpenseType) => void;
}

export function ExpenseTypeSelect({ value, onChange }: ExpenseTypeSelectProps) {
  const t = useTranslations("Common");
  const hint = value ? t(`expenseTypeHints.${value}`) : undefined;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("type")}</p>
      <div className="flex gap-2 flex-wrap">
        {EXPENSE_TYPES.map((et) => (
          <button
            key={et.value}
            type="button"
            onClick={() => onChange(et.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              value === et.value
                ? { backgroundColor: "oklch(0.585 0.233 277)", color: "#fff", borderColor: "oklch(0.585 0.233 277)" }
                : {}
            }
          >
            {t(`expenseTypes.${et.value}`)}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
    </div>
  );
}
