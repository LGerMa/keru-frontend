"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatCurrency, formatMonth } from "@/lib/utils";
import type { DashboardSummary, MonthTrend } from "@/types/dashboard";

interface HeroCardProps {
  summary: DashboardSummary;
  trends: MonthTrend[];
  balanceDelta?: number | null; // percent change vs previous month
}

// Inline sparkline — draws the last N months of expenses as a small area chart
function Sparkline({ trends }: { trends: MonthTrend[] }) {
  const locale = useLocale();
  if (trends.length < 2) return null;
  // Chart area is W×H; PAD_X leaves room for the end labels, LABEL_H for the month row.
  const W = 220, H = 60, PAD_X = 14, LABEL_H = 14;
  const pts = trends.map((t) => t.totalExpenses);
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const xp = (i: number) => PAD_X + (i / (pts.length - 1)) * (W - 2 * PAD_X);
  const yp = (v: number) => H - 8 - ((v - min) / range) * (H - 20);
  const linePath = pts
    .map((v, i) => `${i === 0 ? "M" : "L"}${xp(i)},${yp(v)}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L${xp(pts.length - 1)},${H} L${xp(0)},${H} Z`;

  return (
    <svg
      width={W}
      height={H + LABEL_H}
      viewBox={`0 0 ${W} ${H + LABEL_H}`}
      className="block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.28" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#hero-sparkline-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* dot on last point */}
      <circle
        cx={xp(pts.length - 1)}
        cy={yp(pts[pts.length - 1])}
        r="4"
        fill="white"
      />
      {/* month labels — only first, middle, last to avoid crowding; anchors clamped at the edges */}
      {trends.map((t, i) => {
        const isFirst = i === 0;
        const isLast = i === trends.length - 1;
        const isMid = i === Math.floor((trends.length - 1) / 2);
        if (!isFirst && !isLast && !isMid) return null;
        const label = new Intl.DateTimeFormat(locale, { month: "short" }).format(
          new Date(t.month + "-01")
        );
        return (
          <text
            key={t.month}
            x={xp(i)}
            y={H + 10}
            textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
            fontSize="9"
            fill="rgba(255,255,255,0.75)"
            fontFamily="Inter, ui-sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function HeroCard({ summary, trends, balanceDelta }: HeroCardProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const savingsRate =
    summary.totalIncome > 0
      ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
      : "0.0";

  const hasDelta = balanceDelta !== null && balanceDelta !== undefined;
  const deltaPositive = (balanceDelta ?? 0) >= 0;

  return (
    <div
      className="gradient-hero rounded-[28px] shadow-hero relative overflow-hidden mb-4"
      style={{ padding: "28px 32px 26px" }}
    >
      {/* Radial highlight glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 88% -15%, rgba(255,255,255,0.22), transparent 50%), radial-gradient(circle at 0% 110%, rgba(255,255,255,0.10), transparent 45%)",
        }}
      />

      <div className="relative flex items-end justify-between gap-6">
        {/* Left — numbers */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {t("heroBalance", { month: formatMonth(summary.month, locale) })}
          </p>
          <p
            className="text-white font-extrabold leading-none"
            style={{ fontSize: 52, letterSpacing: "-0.04em" }}
          >
            {formatCurrency(summary.balance)}
          </p>
          <div className="flex gap-6 mt-5">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t("heroIncome")}
              </p>
              <p className="text-lg font-bold" style={{ color: "#bbf7d0" }}>
                +{formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div className="w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t("heroExpenses")}
              </p>
              <p className="text-lg font-bold text-white/95">
                -{formatCurrency(summary.totalExpenses)}
              </p>
            </div>
            <div className="w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t("heroSavingsRate")}
              </p>
              <p className="text-lg font-bold text-white">{savingsRate}%</p>
            </div>
          </div>
        </div>

        {/* Right — delta badge + sparkline */}
        <div className="flex-shrink-0 text-right">
          {hasDelta && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                {deltaPositive ? (
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                ) : (
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                )}
              </svg>
              {deltaPositive ? "+" : ""}
              {balanceDelta!.toFixed(1)}% {t("heroVsLastMonth")}
            </div>
          )}
          <Sparkline trends={trends} />
        </div>
      </div>
    </div>
  );
}
