"use client";

import { useState } from "react";
import { useLandingT, useLandingList } from "@/context/landing-locale-context";

export function PricingSection() {
  const { t } = useLandingT();
  const [yearly, setYearly] = useState(false);

  const freeHas = useLandingList("Pricing.free.has");
  const freeHasNot = useLandingList("Pricing.free.hasNot");
  const proHas = useLandingList("Pricing.pro.has");

  return (
    <section id="precios" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid md:grid-cols-[1fr_minmax(0,320px)] gap-10">
          <div className="order-2 md:order-1 grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl shadow-card-md border border-border p-6 flex flex-col">
              <h3 className="text-lg font-bold">{t("Pricing.free.name")}</h3>
              <p className="mt-2 text-3xl font-extrabold">$0</p>
              <p className="text-xs text-muted-foreground mb-4">{t("Pricing.forever")}</p>
              <PlanList items={freeHas} positive />
              <PlanList items={freeHasNot} positive={false} />
              <a
                href="https://app.keru.me/register"
                className="mt-auto inline-flex justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold"
              >
                {t("Landing.cta.primary")}
              </a>
            </div>

            <div className="bg-card rounded-2xl shadow-hero border border-primary/30 p-6 flex flex-col relative">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1">
                {t("Landing.features.proBadge")}
              </span>
              <h3 className="text-lg font-bold">{t("Pricing.pro.name")}</h3>
              <p className="mt-2 text-3xl font-extrabold">
                {yearly ? "$48" : "$5"}
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  {yearly ? t("Pricing.perYear") : t("Pricing.perMonth")}
                </span>
              </p>
              {yearly ? (
                <p className="text-xs text-primary font-semibold mb-4">{t("Pricing.save")}</p>
              ) : (
                <div className="mb-4 h-[1em]" />
              )}
              <PlanList items={proHas} positive />
              <a
                href="https://app.keru.me/register"
                className="mt-auto inline-flex justify-center rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-colored"
              >
                {t("Landing.cta.pro")}
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              {t("Pricing.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("Pricing.title")}</h2>

            <div className="mt-6 inline-flex items-center rounded-full border border-border p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t("Pricing.monthly")}
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t("Pricing.yearly")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanList({ items, positive }: { items: string[]; positive: boolean }) {
  return (
    <ul className="space-y-2 mb-4 text-sm">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-2 ${positive ? "" : "text-muted-foreground"}`}>
          <span className={positive ? "text-primary" : "text-muted-foreground"}>{positive ? "✓" : "–"}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
