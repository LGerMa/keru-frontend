import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { TagBreakdown } from "@/types/dashboard";

interface TopTagsProps {
  breakdowns: TagBreakdown[];
}

export function TopTags({ breakdowns }: TopTagsProps) {
  if (breakdowns.length === 0) return null;

  const tagged = breakdowns.filter((b) => !b.untagged);
  const grandTotal = tagged.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Top tags</p>
        <Link href="/tags" className="text-xs text-muted-foreground underline underline-offset-4">
          See all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {tagged.map(({ tag, total }) => {
          const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
          return (
            <div
              key={tag.id}
              className="flex-shrink-0 rounded-xl p-3 min-w-[90px]"
              style={{ backgroundColor: `${tag.color}20` }}
            >
              <p className="text-xs font-medium" style={{ color: tag.color }}>
                {tag.name}
              </p>
              <p className="text-sm font-semibold mt-1 text-foreground">
                {formatCurrency(total)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pct.toFixed(0)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
