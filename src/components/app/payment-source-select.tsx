"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePaymentSources } from "@/hooks/use-payment-sources";
import type { PaymentMethod } from "@/lib/constants";

interface PaymentSourceSelectProps {
  value: string;
  onChange: (value: string) => void;
  /** Called with a source's payment method when a source that has one is picked. */
  onPickMethod?: (method: PaymentMethod) => void;
}

export function PaymentSourceSelect({ value, onChange, onPickMethod }: PaymentSourceSelectProps) {
  const t = useTranslations("Common");
  const { paymentSources, isLoading } = usePaymentSources();

  if (isLoading) {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("cardOrAccountOptional")}</p>
        <div className="h-8 rounded-full bg-muted animate-pulse w-40" />
      </div>
    );
  }

  if (paymentSources.length === 0) {
    return (
      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("cardOrAccountOptional")}</p>
        <Link href="/payment-sources" className="text-xs text-primary font-semibold underline underline-offset-4">
          {t("addPaymentSource")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("cardOrAccountOptional")}</p>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onChange("")}
          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
          style={
            value === ""
              ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderColor: "hsl(var(--primary))" }
              : {}
          }
        >
          {t("none")}
        </button>
        {paymentSources.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                if (s.paymentMethod) onPickMethod?.(s.paymentMethod);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={
                selected
                  ? { backgroundColor: `${s.color}20`, color: s.color, borderColor: s.color }
                  : {}
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              {s.alias}
            </button>
          );
        })}
      </div>
    </div>
  );
}
