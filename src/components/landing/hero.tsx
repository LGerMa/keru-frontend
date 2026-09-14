"use client";

import { useLandingT } from "@/context/landing-locale-context";
import { HeroMock } from "./hero-mock";

export function Hero() {
  const { t, rich } = useLandingT();

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            {t("Landing.hero.eyebrow")}
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {rich("Landing.hero.headline", {
              em: (chunk) => <span className="text-primary">{chunk}</span>,
            })}
          </h1>

          <div className="my-6 h-px bg-border" />

          <p className="text-base text-muted-foreground leading-relaxed">
            {rich("Landing.hero.sub", {
              strong: (chunk) => <strong className="font-semibold text-foreground">{chunk}</strong>,
            })}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://app.keru.me/register"
              className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-colored"
            >
              {t("Landing.cta.primary")}
            </a>
            <a
              href="#funciones"
              className="inline-flex items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground"
            >
              {t("Landing.cta.secondary")}
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">{t("Landing.hero.micro")}</p>
        </div>

        <HeroMock />
      </div>
    </section>
  );
}
