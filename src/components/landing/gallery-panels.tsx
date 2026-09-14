"use client";

import { useLandingT, useLandingMonths, useLandingList } from "@/context/landing-locale-context";

const SAMPLE_TAGS = [
  { key: "food", color: "#EF4444", pct: 38, amount: "$420" },
  { key: "housing", color: "#8B5CF6", pct: 27, amount: "$300" },
  { key: "transport", color: "#F59E0B", pct: 21, amount: "$235" },
  { key: "subscriptions", color: "#3B82F6", pct: 14, amount: "$155" },
];

export function BudgetsPanel() {
  const { t } = useLandingT();
  return (
    <div className="bg-card rounded-2xl shadow-card-md border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {t("Landing.gallery.panelTitles.budgets")}
      </p>
      <div className="space-y-3">
        {SAMPLE_TAGS.map((tag) => {
          const barColor = tag.pct >= 35 ? "#EF4444" : tag.pct >= 25 ? "#F59E0B" : "#22C55E";
          return (
            <div key={tag.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2 font-medium capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ background: tag.color }} />
                  {t(`Landing.categories.${tag.key}`)}
                </span>
                <span className="tabular-nums font-bold">{tag.amount}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(tag.pct * 2, 100)}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TREND_BARS = [
  { income: 60, expenses: 45 },
  { income: 68, expenses: 50 },
  { income: 55, expenses: 62 },
  { income: 72, expenses: 48 },
  { income: 64, expenses: 58 },
  { income: 80, expenses: 52 },
];

export function TrendsPanel() {
  const { t } = useLandingT();
  return (
    <div className="bg-card rounded-2xl shadow-card-md border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {t("Landing.gallery.panelTitles.trends")}
      </p>
      <div className="flex items-end gap-3 h-32">
        {TREND_BARS.map((bar, index) => (
          <div key={index} className="flex-1 flex items-end gap-0.5 h-full">
            <div
              className="flex-1 rounded-t-[4px]"
              style={{ height: `${bar.income}%`, backgroundColor: "#22C55E" }}
            />
            <div
              className="flex-1 rounded-t-[4px]"
              style={{ height: `${bar.expenses}%`, backgroundColor: "#6366f1" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {useLandingMonths().map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}

const TRANSACTION_ROWS = ["r1", "r2", "r3", "r4", "r5"] as const;
const ROW_COLORS: Record<string, string> = {
  r1: "#EF4444",
  r2: "#22C55E",
  r3: "#8B5CF6",
  r4: "#F59E0B",
  r5: "#3B82F6",
};

export function TransactionsPanel() {
  const { t } = useLandingT();
  return (
    <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("Landing.gallery.panelTitles.transactions")}
        </p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["date", "description", "category", "amount"].map((col) => (
              <th
                key={col}
                className="text-left px-5 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
              >
                {t(`Landing.gallery.table.${col}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRANSACTION_ROWS.map((row) => (
            <tr key={row}>
              <td className="px-5 py-3 border-b border-border text-sm">{t(`Landing.gallery.dates.d${row.slice(1)}`)}</td>
              <td className="px-5 py-3 border-b border-border text-sm">{t(`Landing.gallery.rows.${row}`)}</td>
              <td className="px-5 py-3 border-b border-border text-sm">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${ROW_COLORS[row]}18`, color: ROW_COLORS[row] }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ROW_COLORS[row] }} />
                  {t("Landing.gallery.internet")}
                </span>
              </td>
              <td className="px-5 py-3 border-b border-border text-sm text-right font-bold">-$42.30</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const RECURRING_ROWS = ["n1", "n2", "n3", "n4", "n5"] as const;
const RECURRING_COLORS: Record<string, string> = {
  n1: "#3B82F6",
  n2: "#EF4444",
  n3: "#22C55E",
  n4: "#8B5CF6",
  n5: "#F59E0B",
};

export function RecurringPanel() {
  const { t } = useLandingT();
  const names = useLandingList("Landing.gallery.recurringNames");
  return (
    <div className="bg-card rounded-2xl shadow-card-md border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {t("Landing.gallery.panelTitles.recurring")}
      </p>
      <div className="divide-y divide-border">
        {RECURRING_ROWS.map((row, index) => {
          const name = names[index] ?? t("Landing.gallery.internet");
          const color = RECURRING_COLORS[row];
          return (
            <div key={row} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 flex items-center justify-center text-xs font-bold"
                  style={{ borderRadius: 10, background: `${color}18`, color }}
                >
                  {name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("Landing.gallery.next")} · {t(`Landing.gallery.recurringDates.${row}`)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold">${(15 + index * 3).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AddExpensePanel() {
  const { t } = useLandingT();
  return (
    <div className="bg-card rounded-2xl shadow-card-md border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {t("Landing.gallery.panelTitles.add")}
      </p>

      <label className="text-xs text-muted-foreground mb-1 block">{t("Landing.gallery.form.amount")}</label>
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
        <div className="w-full border border-border rounded-xl pl-7 pr-4 py-3 text-2xl font-medium">8.50</div>
      </div>

      <label className="text-xs text-muted-foreground mb-1 block">{t("Landing.gallery.form.description")}</label>
      <div className="w-full border border-border rounded-xl px-4 py-3 text-sm mb-4">
        {t("Landing.gallery.form.descriptionValue")}
      </div>

      <label className="text-xs text-muted-foreground mb-1 block">{t("Landing.gallery.form.category")}</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries({ food: "#EF4444", transport: "#F59E0B", housing: "#8B5CF6" }).map(([key, color]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color, background: `${color}22`, outline: `1.5px solid ${color}` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {t(`Landing.categories.${key}`)}
          </span>
        ))}
      </div>

      <div className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium text-center">
        {t("Landing.gallery.form.save")}
      </div>
    </div>
  );
}
