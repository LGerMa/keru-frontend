"use client";

import { useLandingT } from "@/context/landing-locale-context";

const FEATURES = [
  { key: "f1", pro: false },
  { key: "f2", pro: true },
  { key: "f3", pro: true },
  { key: "f4", pro: false },
  { key: "f5", pro: false },
  { key: "f6", pro: false },
] as const;

export function Features() {
  const { t } = useLandingT();

  return (
    <section id="funciones" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid md:grid-cols-[1fr_minmax(0,280px)] gap-10">
          <div className="grid sm:grid-cols-2 gap-4 order-2 md:order-1">
            {FEATURES.map((feature) => (
              <div
                key={feature.key}
                className="bg-card rounded-2xl shadow-card-md border border-border p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">{t(`Landing.features.${feature.key}.title`)}</h3>
                  {feature.pro && (
                    <span className="text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                      {t("Landing.features.proBadge")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`Landing.features.${feature.key}.body`)}
                </p>
              </div>
            ))}
          </div>

          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              {t("Landing.features.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("Landing.features.title")}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("Landing.features.sub")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
