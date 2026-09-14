"use client";

import { useLandingT } from "@/context/landing-locale-context";

const LINKS: { key: string }[] = [
  { key: "LandingFooter.privacy" },
  { key: "LandingFooter.terms" },
  { key: "LandingFooter.contact" },
  { key: "LandingFooter.changelog" },
];

export function LandingFooter() {
  const { t } = useLandingT();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold tracking-tight">
          keru<span className="text-primary">.</span>
        </span>

        <nav className="flex items-center gap-5">
          {LINKS.map((link) => (
            <a
              key={link.key}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <span className="text-xs text-muted-foreground">{t("LandingFooter.copyright")}</span>
      </div>
    </footer>
  );
}
