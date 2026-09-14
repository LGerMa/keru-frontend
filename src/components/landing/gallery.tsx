"use client";

import { useState } from "react";
import { useLandingT } from "@/context/landing-locale-context";
import {
  BudgetsPanel,
  TrendsPanel,
  TransactionsPanel,
  RecurringPanel,
  AddExpensePanel,
} from "./gallery-panels";

const TABS = [
  { key: "budgets", Panel: BudgetsPanel },
  { key: "trends", Panel: TrendsPanel },
  { key: "transactions", Panel: TransactionsPanel },
  { key: "recurring", Panel: RecurringPanel },
  { key: "add", Panel: AddExpensePanel },
] as const;

export function Gallery() {
  const { t } = useLandingT();
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("budgets");

  const ActivePanel = TABS.find((tab) => tab.key === active)?.Panel ?? BudgetsPanel;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t("Landing.gallery.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("Landing.gallery.title")}</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("Landing.gallery.sub")}</p>

          <div className="mt-6 flex flex-col gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={`text-left text-sm font-medium rounded-xl px-3 py-2 transition-colors ${
                  active === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t(`Landing.gallery.tabs.${tab.key}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <ActivePanel />
        </div>
      </div>
    </section>
  );
}
