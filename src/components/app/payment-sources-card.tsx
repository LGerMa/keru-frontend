"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { PaymentSource } from "@/types/payment-source";

interface PaymentSourcesCardProps {
  sources: PaymentSource[];
  onSelect: (source: PaymentSource) => void;
}

export function PaymentSourcesCard({ sources, onSelect }: PaymentSourcesCardProps) {
  const t = useTranslations("Common");

  function methodLabel(method: PaymentSource["paymentMethod"]): string | null {
    return PAYMENT_METHODS.find((m) => m.value === method) ? t(`paymentMethods.${method}`) : null;
  }

  return (
    <div className="flex flex-col">
      {sources.map((source) => {
        const label = methodLabel(source.paymentMethod);
        return (
          <button
            key={source.id}
            onClick={() => onSelect(source)}
            className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/40 transition-colors -mx-1 px-1 rounded-lg text-left"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: source.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: source.color }}>
                {source.alias}
              </p>
              {label && (
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              )}
            </div>
            <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
