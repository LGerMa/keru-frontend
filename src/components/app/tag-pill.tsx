import type { Tag } from "@/types/tag";
import type { ExpenseTag } from "@/types/expense";
import type { IncomeTag } from "@/types/income";
import type { TagBreakdownTag } from "@/types/dashboard";

type AnyTag = Tag | ExpenseTag | IncomeTag | TagBreakdownTag;

interface TagPillProps {
  tag: AnyTag;
  size?: "sm" | "md";
}

export function TagPill({ tag, size = "md" }: TagPillProps) {
  return (
    <span
      className={
        size === "sm"
          ? "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          : "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      }
      style={{ color: tag.color, backgroundColor: `${tag.color}20` }}
    >
      {tag.name}
    </span>
  );
}
