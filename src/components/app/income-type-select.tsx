import { useTranslations } from "next-intl";
import type { IncomeType } from "@/types/income";

const INCOME_TYPE_VALUES: IncomeType[] = ["fixed_monthly", "fixed_biweekly", "sporadic"];

interface IncomeTypeSelectProps {
  value: IncomeType | "";
  onChange: (value: IncomeType) => void;
}

export function IncomeTypeSelect({ value, onChange }: IncomeTypeSelectProps) {
  const t = useTranslations("Common");
  const incomeTypes: { value: IncomeType; label: string }[] = INCOME_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`incomeTypes.${v}`),
  }));

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("type")}</p>
      <div className="flex gap-2 flex-wrap">
        {incomeTypes.map((it) => (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              value === it.value
                ? { backgroundColor: "#22C55E", color: "#fff", borderColor: "#22C55E" }
                : {}
            }
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
