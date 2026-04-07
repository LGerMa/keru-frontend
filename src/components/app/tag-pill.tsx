import type { Tag } from "@/types/tag";

interface TagPillProps {
  tag: Tag;
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
      style={{ color: tag.color, backgroundColor: tag.background }}
    >
      {tag.name}
    </span>
  );
}
