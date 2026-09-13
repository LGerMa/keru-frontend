"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

interface FlatResult {
  key: string;
  kind: "expense" | "income" | "tag";
  label: string;
  sub: string;
  color?: string;
  onSelect: () => void;
}

export function TopbarSearch() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const { results, isLoading } = useSearch(query);

  const trimmed = query.trim();
  const hasResults =
    results.expenses.length > 0 || results.income.length > 0 || results.tags.length > 0;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const flat: FlatResult[] = [
    ...results.expenses.map((e) => ({
      key: `expense-${e.id}`,
      kind: "expense" as const,
      label: e.description,
      sub: `${formatDate(e.date, undefined, locale)} · ${formatCurrency(e.amount)}`,
      onSelect: () => router.push(`/expenses/${e.id}`),
    })),
    ...results.income.map((i) => ({
      key: `income-${i.id}`,
      kind: "income" as const,
      label: i.description,
      sub: `${formatDate(i.date, undefined, locale)} · ${formatCurrency(i.amount)}`,
      onSelect: () => router.push(`/income/${i.id}`),
    })),
    ...results.tags.map((tag) => ({
      key: `tag-${tag.id}`,
      kind: "tag" as const,
      label: tag.name,
      sub: t("searchTags"),
      color: tag.color,
      onSelect: () => router.push(`/expenses?tag=${encodeURIComponent(tag.name)}`),
    })),
  ];

  function select(result: FlatResult) {
    result.onSelect();
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(flat[activeIndex]);
    }
  }

  function renderSection(label: string, items: FlatResult[]) {
    if (items.length === 0) return null;
    return (
      <div className="py-1">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {items.map((item) => {
          const index = flat.findIndex((f) => f.key === item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => select(item)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors",
                activeIndex === index ? "bg-muted" : "hover:bg-muted"
              )}
            >
              {item.color && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-foreground truncate">
                  {item.label}
                </span>
                <span className="block text-xs text-muted-foreground truncate">{item.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative flex-1 max-w-[380px]" ref={ref}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={t("searchPlaceholder")}
        className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />

      {open && trimmed && (
        <div className="absolute left-0 top-full mt-2 w-[340px] max-h-96 overflow-y-auto rounded-xl border border-border bg-card shadow-card-md z-50">
          {isLoading && !hasResults && (
            <p className="px-3 py-3 text-sm text-muted-foreground">{t("searchLoading")}</p>
          )}
          {!isLoading && !hasResults && (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              {t("searchNoResults", { query: trimmed })}
            </p>
          )}
          {hasResults && (
            <>
              {renderSection(
                t("searchExpenses"),
                flat.filter((f) => f.kind === "expense")
              )}
              {renderSection(
                t("searchIncome"),
                flat.filter((f) => f.kind === "income")
              )}
              {renderSection(
                t("searchTags"),
                flat.filter((f) => f.kind === "tag")
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
