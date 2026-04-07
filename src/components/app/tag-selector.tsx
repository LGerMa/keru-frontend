"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Tag } from "@/types/tag";

interface TagSelectorProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
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
      <p className="text-xs text-muted-foreground mb-2">Tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-opacity"
              style={{
                color: tag.color,
                backgroundColor: `${tag.color}20`,
                opacity: active ? 1 : 0.4,
                outline: active ? `1.5px solid ${tag.color}` : "none",
              }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
