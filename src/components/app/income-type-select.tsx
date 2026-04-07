import type { IncomeType } from "@/types/income";

const INCOME_TYPES: { value: IncomeType; label: string }[] = [
  { value: "fixed_monthly",   label: "Monthly" },
  { value: "fixed_biweekly", label: "Biweekly" },
  { value: "sporadic",        label: "Sporadic" },
];

interface IncomeTypeSelectProps {
  value: IncomeType | "";
  onChange: (value: IncomeType) => void;
}

export function IncomeTypeSelect({ value, onChange }: IncomeTypeSelectProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Type</p>
      <div className="flex gap-2 flex-wrap">
        {INCOME_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              value === t.value
                ? { backgroundColor: "#22C55E", color: "#fff", borderColor: "#22C55E" }
                : {}
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
