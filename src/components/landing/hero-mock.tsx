"use client";

import { useLandingT } from "@/context/landing-locale-context";

export function HeroMock() {
  const { t } = useLandingT();

  return (
    <div className="relative rounded-[28px] gradient-hero shadow-hero p-6 text-white overflow-hidden max-w-sm mx-auto">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 88% -15%, rgba(255,255,255,0.22), transparent 50%), radial-gradient(circle at 0% 110%, rgba(255,255,255,0.10), transparent 45%)",
        }}
      />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.65)" }}>
          {t("Landing.heroMock.spend")}
        </p>

        <p className="mt-2 font-extrabold leading-none" style={{ fontSize: 44, letterSpacing: "-0.03em" }}>
          $1,247.50
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.15)" }}>
          {t("Landing.heroMock.delta")}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm font-bold">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t("Landing.heroMock.income")}
            </p>
            <p style={{ color: "#bbf7d0" }}>+$2,500.00</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t("Landing.heroMock.savings")}
            </p>
            <p className="text-white/95">18%</p>
          </div>
        </div>

        <svg viewBox="0 0 220 60" className="mt-6 w-full h-14" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hero-mock-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.28" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points="0,45 35,38 70,42 105,25 140,30 175,15 220,20"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon points="0,45 35,38 70,42 105,25 140,30 175,15 220,20 220,60 0,60" fill="url(#hero-mock-fade)" />
          <circle cx="220" cy="20" r="3.5" fill="white" />
        </svg>
      </div>
    </div>
  );
}
