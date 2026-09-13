"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { TagBadge } from "@/components/app/tag-badge";
import type { RecurringEntry } from "@/types/recurring";

interface RecurringWatchlistProps {
  entries: RecurringEntry[];
  limit?: number;
}

type Status = "upcoming" | "active" | "paid" | "overdue";

function getStatus(entry: RecurringEntry): Status {
  if (!entry.isActive) return "paid";
  const next = new Date(entry.nextDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "overdue";
  if (diffDays <= 7) return "upcoming";
  return "active";
}

function StatusBadge({ status, t }: { status: Status; t: ReturnType<typeof useTranslations> }) {
  const styles: Record<Status, { bg: string; fg: string; label: string }> = {
    upcoming: {
      bg: "rgba(99, 102, 241, 0.12)",
      fg: "#6366f1",
      label: t("statusUpcoming"),
    },
    active: {
      bg: "var(--muted)",
      fg: "var(--muted-foreground)",
      label: t("statusScheduled"),
    },
    paid: {
      bg: "rgba(34, 197, 94, 0.12)",
      fg: "#22C55E",
      label: t("statusPaid"),
    },
    overdue: {
      bg: "rgba(239, 68, 68, 0.12)",
      fg: "#EF4444",
      label: t("statusOverdue"),
    },
  };
  const s = styles[status];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

export function RecurringWatchlist({
  entries,
  limit = 6,
}: RecurringWatchlistProps) {
  const t = useTranslations("Dashboard");
  const tRecurring = useTranslations("Recurring");
  const locale = useLocale();
  // Show expense entries only, sorted by nextDate asc
  const expenses = entries
    .filter((e) => e.entryType === "expense")
    .sort(
      (a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()
    )
    .slice(0, limit);

  const totalMonthly = expenses.reduce((sum, e) => {
    // Normalise weekly/biweekly to monthly equivalent
    if (e.frequency === "weekly") return sum + e.amount * 4.33;
    if (e.frequency === "biweekly") return sum + e.amount * 2.17;
    return sum + e.amount;
  }, 0);

  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {t("noRecurring")}
      </p>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground mb-1">
        {expenses.length === 1
          ? t("recurringCountOne", { count: expenses.length })
          : t("recurringCountOther", { count: expenses.length })}{" "}
        ·{" "}
        <strong className="text-foreground">
          {formatCurrency(totalMonthly)}{t("perMonth")}
        </strong>
      </p>
      <div>
        {expenses.map((entry) => {
          const status = getStatus(entry);
          const primaryTag = entry.tags[0];
          const tagColor = primaryTag?.color ?? "#6366f1";
          const tagName = primaryTag?.name ?? "other";
          const nextFmt = new Intl.DateTimeFormat(locale, {
            month: "short",
            day: "numeric",
          }).format(new Date(entry.nextDate));

          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 py-3 border-b border-border last:border-0"
            >
              <TagBadge color={tagColor} name={tagName} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {entry.description ?? t("recurringFallback")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tRecurring(`frequency.${entry.frequency}`)} · {t("nextDate", { date: nextFmt })}
                </p>
              </div>
              <StatusBadge status={status} t={t} />
              <p className="text-sm font-bold tabular-nums min-w-[52px] text-right">
                {formatCurrency(entry.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
