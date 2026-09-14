"use client";

import Link from "next/link";
import { useLandingT, type LandingLocale } from "@/context/landing-locale-context";

const ANCHOR_LINKS: { href: string; key: string }[] = [
  { href: "#como", key: "LandingNav.how" },
  { href: "#funciones", key: "LandingNav.features" },
  { href: "#precios", key: "LandingNav.pricing" },
  { href: "#faq", key: "LandingNav.faq" },
];

export function LandingNav() {
  const { t, locale, setLocale } = useLandingT();

  function toggleLocale(next: LandingLocale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          keru<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {ANCHOR_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => toggleLocale("es")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                locale === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => toggleLocale("en")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="https://app.keru.me/login"
            className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("Landing.cta.login")}
          </a>

          <a
            href="https://app.keru.me/register"
            className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-colored"
          >
            {t("Landing.cta.primary")}
          </a>
        </div>
      </div>
    </header>
  );
}
