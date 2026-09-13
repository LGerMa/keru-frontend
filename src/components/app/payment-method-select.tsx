import { useTranslations } from "next-intl";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { PaymentMethod } from "@/lib/constants";

interface PaymentMethodSelectProps {
  value: PaymentMethod | "";
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  const t = useTranslations("Common");
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("paymentMethod")}</p>
      <div className="flex gap-2 flex-wrap">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              value === m.value
                ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderColor: "hsl(var(--primary))" }
                : {}
            }
          >
            {t(`paymentMethods.${m.value}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
