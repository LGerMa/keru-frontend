"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { TagBreakdown, TagBreakdownTag } from "@/types/dashboard";

interface CategoryDonutProps {
  breakdowns: TagBreakdown[];
  size?: number;
  thickness?: number;
  /** When provided, segments and legend rows become clickable. */
  onSelectTag?: (tag: TagBreakdownTag) => void;
}

interface TooltipState {
  name: string;
  color: string;
  total: number;
  pct: number;
  x: number;
  y: number;
  /** Show below the cursor instead of above (near the top edge). */
  below: boolean;
}

function toXY(
  cx: number,
  cy: number,
  r: number,
  fraction: number
): [number, number] {
  const angle = fraction * Math.PI * 2 - Math.PI / 2;
  return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
}

export function CategoryDonut({
  breakdowns,
  size = 190,
  thickness = 28,
  onSelectTag,
}: CategoryDonutProps) {
  const t = useTranslations("Dashboard");
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [infoHovered, setInfoHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  const items = breakdowns.filter((b) => !b.untagged && b.total > 0);
  const total = items.reduce((s, b) => s + b.total, 0);

  if (items.length === 0 || total === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {t("noCategoryData")}
      </p>
    );
  }

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const segments = items.map((item) => {
    const frac = item.total / total;
    const start = acc;
    const end = acc + frac;
    acc = end;

    const [x0, y0] = toXY(cx, cy, r, start);
    const [x1, y1] = toXY(cx, cy, r, end);
    const large = frac > 0.5 ? 1 : 0;

    return {
      path: `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1}`,
      color: item.tag.color,
      name: item.tag.name,
      tag: item.tag,
      total: item.total,
      pct: frac * 100,
    };
  });

  function showTooltip(s: (typeof segments)[number], e: { clientX: number; clientY: number }) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({
      name: s.name,
      color: s.color,
      total: s.total,
      pct: s.pct,
      x: Math.max(60, Math.min(x, rect.width - 60)),
      y,
      below: y < 64,
    });
  }

  return (
    <div>
    <div ref={containerRef} className="relative flex items-center gap-5">
      {/* Donut SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="flex-shrink-0"
        aria-label={t("donutAriaLabel")}
        onPointerLeave={() => { setHovered(null); setTooltip(null); }}
      >
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={hovered === i ? thickness + 4 : thickness}
            strokeLinecap="butt"
            pointerEvents="stroke"
            onClick={onSelectTag ? () => onSelectTag(s.tag) : undefined}
            onPointerEnter={() => setHovered(i)}
            onPointerMove={(e) => showTooltip(s, e)}
            className={`transition-[stroke-width] duration-150 ${onSelectTag ? "cursor-pointer" : ""}`}
          />
        ))}
        {/* Blocks the center hole from re-triggering the last segment's hover */}
        <circle
          cx={cx}
          cy={cy}
          r={r - thickness / 2}
          fill="transparent"
          onPointerEnter={() => { setHovered(null); setTooltip(null); }}
        />
        {/* Center label */}
        <text
          x={cx - 6}
          y={cy - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--muted-foreground)"
          letterSpacing="0.1em"
          fontFamily="Inter, ui-sans-serif"
        >
          {t("donutCenterLabel")}
        </text>
        <text
          x={cx}
          y={cy + 17}
          textAnchor="middle"
          fontSize="19"
          fontWeight="800"
          fill="var(--foreground)"
          fontFamily="Inter, ui-sans-serif"
          style={{ letterSpacing: "-0.03em" }}
        >
          {formatCurrency(total)}
        </text>
        <g
          role="button"
          tabIndex={0}
          aria-label={t("multiTagNote")}
          onPointerEnter={() => setInfoHovered(true)}
          onPointerLeave={() => setInfoHovered(false)}
          onFocus={() => setInfoHovered(true)}
          onBlur={() => setInfoHovered(false)}
          onClick={() => noteRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
          className="cursor-pointer"
        >
          <circle
            cx={cx + 30}
            cy={cy - 11}
            r={6}
            fill="none"
            stroke={infoHovered ? "var(--foreground)" : "var(--muted-foreground)"}
            strokeWidth={1.3}
            className="transition-colors"
          />
          <text
            x={cx + 30}
            y={cy - 8}
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={infoHovered ? "var(--foreground)" : "var(--muted-foreground)"}
            fontFamily="Inter, ui-sans-serif"
            className="transition-colors"
          >
            i
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {segments.map((s, i) => {
          const Row = onSelectTag ? "button" : "div";
          return (
            <Row
              key={s.name}
              {...(onSelectTag ? { onClick: () => onSelectTag(s.tag), type: "button" as const } : {})}
              onPointerEnter={() => setHovered(i)}
              onPointerMove={(e) => showTooltip(s, e)}
              onPointerLeave={() => { setHovered(null); setTooltip(null); }}
              onFocus={() => setHovered(i)}
              onBlur={() => { setHovered(null); setTooltip(null); }}
              className={`flex items-center gap-2 w-full text-left rounded-md -mx-1 px-1 py-0.5 transition-colors ${
                onSelectTag ? "cursor-pointer" : ""
              } ${hovered === i ? "bg-muted" : ""}`}
            >
              <span
                className="flex-shrink-0 rounded-sm"
                style={{ width: 8, height: 8, background: s.color }}
              />
              <span className="text-sm font-medium capitalize flex-1 truncate">
                {s.name}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums w-9 text-right">
                {s.pct.toFixed(0)}%
              </span>
              <span className="text-sm font-bold tabular-nums w-16 text-right">
                {formatCurrency(s.total)}
              </span>
            </Row>
          );
        })}
      </div>

      {/* Tooltip — value leads, name follows */}
      {tooltip && (
        <div
          className={`pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 shadow-card-md whitespace-nowrap ${
            tooltip.below ? "translate-y-4" : "-translate-y-[calc(100%+10px)]"
          }`}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-sm font-bold text-foreground leading-tight">
            {formatCurrency(tooltip.total)}
            <span className="ml-1.5 text-xs font-medium text-muted-foreground">
              {tooltip.pct.toFixed(0)}%
            </span>
          </p>
          <p className="text-xs text-muted-foreground capitalize leading-tight mt-0.5 flex items-center gap-1.5">
            <span
              className="inline-block rounded-sm flex-shrink-0"
              style={{ width: 7, height: 7, background: tooltip.color }}
            />
            {tooltip.name}
          </p>
        </div>
      )}
    </div>

      <p
        ref={noteRef}
        className={`mt-4 text-xs leading-snug rounded-md transition-colors ${
          infoHovered ? "text-foreground bg-muted -mx-1 px-1 py-0.5" : "text-muted-foreground/80"
        }`}
      >
        {t("multiTagNote")}
      </p>
    </div>
  );
}
