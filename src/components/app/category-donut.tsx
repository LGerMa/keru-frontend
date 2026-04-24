"use client";

import { formatCurrency } from "@/lib/utils";
import type { TagBreakdown } from "@/types/dashboard";

interface CategoryDonutProps {
  breakdowns: TagBreakdown[];
  size?: number;
  thickness?: number;
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
}: CategoryDonutProps) {
  const items = breakdowns.filter((b) => !b.untagged && b.total > 0);
  const total = items.reduce((s, b) => s + b.total, 0);

  if (items.length === 0 || total === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No category data for this month.
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
      total: item.total,
      pct: frac * 100,
    };
  });

  return (
    <div className="flex items-center gap-5">
      {/* Donut SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="flex-shrink-0"
        aria-label="Category spending donut chart"
      >
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
          />
        ))}
        {/* Center label */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--muted-foreground)"
          letterSpacing="0.1em"
          fontFamily="Inter, ui-sans-serif"
        >
          SPENT
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
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {segments.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}
