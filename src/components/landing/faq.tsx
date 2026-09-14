"use client";

import { useLandingT } from "@/context/landing-locale-context";

const QUESTIONS = ["q1", "q2", "q3"] as const;

export function Faq() {
  const { t } = useLandingT();

  return (
    <section id="faq" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            {t("Landing.faq.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("Landing.faq.title")}</h2>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <details
              key={q}
              className="bg-card rounded-2xl shadow-card-sm border border-border p-5 group"
            >
              <summary className="text-sm font-semibold cursor-pointer list-none flex items-center justify-between">
                {t(`Landing.faq.${q}`)}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t(`Landing.faq.a${q.slice(1)}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
