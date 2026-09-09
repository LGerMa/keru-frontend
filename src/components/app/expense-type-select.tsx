import { EXPENSE_TYPES } from "@/lib/constants";
import type { ExpenseType } from "@/lib/constants";

interface ExpenseTypeSelectProps {
  value: ExpenseType | "";
  onChange: (value: ExpenseType) => void;
}

export function ExpenseTypeSelect({ value, onChange }: ExpenseTypeSelectProps) {
  const hint = EXPENSE_TYPES.find((t) => t.value === value)?.hint;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Type</p>
      <div className="flex gap-2 flex-wrap">
        {EXPENSE_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              value === t.value
                ? { backgroundColor: "oklch(0.585 0.233 277)", color: "#fff", borderColor: "oklch(0.585 0.233 277)" }
                : {}
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
    </div>
  );
}
