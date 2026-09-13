"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import type { Tag } from "@/types/tag";

interface TagSelectorProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
  const t = useTranslations("Common");
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    api.get<Tag[]>("/v1/tags").then(setTags).catch(() => {});
  }, []);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  if (tags.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{t("tags")}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                color: active ? tag.color : "var(--muted-foreground)",
                backgroundColor: active ? `${tag.color}22` : "var(--muted)",
                outline: active ? `1.5px solid ${tag.color}` : "1px solid var(--border)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color, opacity: active ? 1 : 0.6 }}
              />
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
