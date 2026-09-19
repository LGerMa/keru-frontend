"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatCurrency, formatDate, parseDateOnly } from "@/lib/utils";
import { TagBadge } from "@/components/app/tag-badge";
import type { RecurringEntry } from "@/types/recurring";

interface RecurringWatchlistProps {
  entries: RecurringEntry[];
  limit?: number;
}

type Status = "upcoming" | "active" | "paid" | "overdue";

function getStatus(entry: RecurringEntry): Status {
  if (!entry.isActive) return "paid";
  const next = parseDateOnly(entry.nextDate);
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
  // Sorted by nextDate asc, expenses and income together
  const upcoming = entries
    .sort(
      (a, b) => parseDateOnly(a.nextDate).getTime() - parseDateOnly(b.nextDate).getTime()
    )
    .slice(0, limit);

  const monthlyEquivalent = (e: RecurringEntry) => {
    // Normalise weekly/biweekly to monthly equivalent
    if (e.frequency === "weekly") return e.amount * 4.33;
    if (e.frequency === "biweekly") return e.amount * 2.17;
    return e.amount;
  };
  const totalMonthly = upcoming.reduce((sum, e) => {
    const monthly = monthlyEquivalent(e);
    return e.entryType === "income" ? sum + monthly : sum - monthly;
  }, 0);

  if (upcoming.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {t("noRecurring")}
      </p>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground mb-1">
        {upcoming.length === 1
          ? t("recurringCountOne", { count: upcoming.length })
          : t("recurringCountOther", { count: upcoming.length })}{" "}
        ·{" "}
        <strong className={totalMonthly < 0 ? "text-foreground" : "text-[#22C55E]"}>
          {totalMonthly < 0 ? "-" : "+"}
          {formatCurrency(Math.abs(totalMonthly))}{t("perMonth")}
        </strong>
      </p>
      <div>
        {upcoming.map((entry) => {
          const isIncome = entry.entryType === "income";
          const status = getStatus(entry);
          const primaryTag = entry.tags[0];
          const tagColor = primaryTag?.color ?? (isIncome ? "#22C55E" : "#6366f1");
          const tagName = primaryTag?.name ?? "other";
          const nextFmt = formatDate(entry.nextDate, { month: "short", day: "numeric", year: undefined }, locale);

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
              <p
                className={`text-sm font-bold tabular-nums min-w-[52px] text-right ${isIncome ? "text-[#22C55E]" : ""}`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(entry.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
