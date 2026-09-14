"use client";

import { useLandingT } from "@/context/landing-locale-context";

export function ClosingCta() {
  const { t } = useLandingT();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="rounded-[28px] gradient-hero shadow-hero px-6 py-14 text-center text-white">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
          {t("Landing.closing.title")}
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/80 max-w-lg mx-auto">
          {t("Landing.closing.sub")}
        </p>
        <a
          href="https://app.keru.me/register"
          className="mt-8 inline-flex items-center rounded-xl bg-white text-primary px-6 py-3 text-sm font-semibold shadow-colored"
        >
          {t("Landing.cta.primary")}
        </a>
      </div>
    </section>
  );
}
