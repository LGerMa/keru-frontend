"use client";

import { useLandingT } from "@/context/landing-locale-context";

const STEPS = ["s1", "s2", "s3"] as const;

export function HowItWorks() {
  const { t } = useLandingT();

  return (
    <section id="como" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t("Landing.how.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("Landing.how.title")}</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("Landing.how.sub")}</p>
        </div>

        <ol className="space-y-6">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{t(`Landing.how.${step}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {t(`Landing.how.${step}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
