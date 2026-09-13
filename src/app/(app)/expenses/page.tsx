"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncome } from "@/hooks/use-income";
import { usePaymentSources } from "@/hooks/use-payment-sources";
import { TransactionItem } from "@/components/app/transaction-item";
import { EmptyState } from "@/components/app/empty-state";
import { currentMonth, formatMonth } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { EXPENSE_TYPES } from "@/lib/constants";

type Tab = "expenses" | "income";

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});

export default function HistoryPage() {
  const t = useTranslations("Expenses");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("expenses");
  const [month, setMonth] = useState<string>(currentMonth());
  const [tagFilter, setTagFilter] = useState<string>(
    () => searchParams.get("tag") ?? ""
  );
  const [paymentSourceId, setPaymentSourceId] = useState<string>(
    () => searchParams.get("paymentSourceId") ?? ""
  );
  const [typeFilter, setTypeFilter] = useState<string>("");

  const { paymentSources } = usePaymentSources();
  const activeSource = paymentSources.find((s) => s.id === paymentSourceId);

  const { expenses, meta: expMeta, isLoading: expLoading, error: expError } =
    useExpenses({ month, tags: tagFilter || undefined, paymentSourceId: paymentSourceId || undefined, type: typeFilter || undefined });
  const { income, meta: incMeta, isLoading: incLoading, error: incError } =
    useIncome({ month });

  const isLoading = tab === "expenses" ? expLoading : incLoading;
  const error     = tab === "expenses" ? expError   : incError;
  const items     = tab === "expenses" ? expenses   : income;
  const meta      = tab === "expenses" ? expMeta    : incMeta;
  const addHref   = tab === "expenses" ? "/expenses/new" : "/income/new";
  const addLabel  = tab === "expenses" ? t("addExpense")   : t("addIncome");
  const emptyTitle = tab === "expenses" ? t("emptyTitleExpenses") : t("emptyTitleIncome");
  const count = meta?.itemCount ?? 0;
  const countLabel =
    tab === "expenses"
      ? (count === 1 ? t("expenseCountOne", { count }) : t("expenseCountOther", { count }))
      : (count === 1 ? t("entryCountOne", { count }) : t("entryCountOther", { count }));

  const isIncome = tab === "income";

  const FilterControls = (
    <>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 bg-card rounded-xl p-1 border border-border">
        {(["expenses", "income"] as Tab[]).map((tabValue) => (
          <button
            key={tabValue}
            onClick={() => setTab(tabValue)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize",
              tab === tabValue
                ? tabValue === "income"
                  ? "text-white"
                  : "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            style={tab === tabValue && tabValue === "income" ? { backgroundColor: "#22C55E" } : {}}
          >
            {tabValue === "expenses" ? t("tabExpenses") : t("tabIncome")}
          </button>
        ))}
      </div>

      {/* Active tag filter */}
      {tagFilter && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-muted-foreground">{t("filteredBy")}</span>
          <button
            onClick={() => setTagFilter("")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary"
          >
            {tagFilter}
            <X size={11} />
          </button>
        </div>
      )}

      {/* Payment source filter — expenses tab only */}
      {tab === "expenses" && paymentSources.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 hidden lg:block">{t("paymentSource")}</p>
          {activeSource ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground lg:hidden">{t("paymentSourceColon")}</span>
              <button
                onClick={() => setPaymentSourceId("")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ color: activeSource.color, backgroundColor: `${activeSource.color}1a` }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: activeSource.color }}
                />
                {activeSource.alias}
                <X size={11} />
              </button>
            </div>
          ) : (
            <select
              value={paymentSourceId}
              onChange={(e) => setPaymentSourceId(e.target.value)}
              className="w-full lg:w-auto border border-border rounded-full bg-card text-xs font-medium px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">{t("allPaymentSources")}</option>
              {paymentSources.map((s) => (
                <option key={s.id} value={s.id}>{s.alias}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Type filter — expenses tab only */}
      {tab === "expenses" && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 hidden lg:block">{t("type")}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground lg:hidden">{t("typeColon")}</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full lg:w-auto border border-border rounded-full bg-card text-xs font-medium px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">{t("allTypes")}</option>
              {EXPENSE_TYPES.map((et) => (
                <option key={et.value} value={et.value}>{tCommon(`expenseTypes.${et.value}`)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Month picker */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 hidden lg:block">{t("month")}</p>
        {/* Mobile: horizontal scroll pill chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
          {MONTHS.map((m) => {
            const isSelected = month === m;
            return (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  isSelected && !isIncome && "bg-primary text-primary-foreground border-primary",
                  isSelected && isIncome && "border-transparent text-white",
                  !isSelected && "bg-card text-muted-foreground border-border"
                )}
                style={isSelected && isIncome ? { backgroundColor: "#22C55E", borderColor: "#22C55E" } : {}}
              >
                {formatMonth(m, locale).split(" ")[0]}
              </button>
            );
          })}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden lg:flex lg:flex-col lg:gap-1">
          {MONTHS.map((m) => {
            const isSelected = month === m;
            return (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  isSelected && !isIncome && "bg-primary text-primary-foreground",
                  isSelected && isIncome && "text-white",
                  !isSelected && "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={isSelected && isIncome ? { backgroundColor: "#22C55E" } : {}}
              >
                {formatMonth(m, locale)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  const TransactionList = (
    <>
      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title={emptyTitle}
          description={t("nothingRecorded", { month: formatMonth(month, locale) })}
          action={
            <Link href={addHref} className="text-xs text-primary font-semibold underline underline-offset-4">
              {t("addNow")}
            </Link>
          }
        />
      )}
      {!isLoading && items.length > 0 && (
        <div>
          <div className="bg-card rounded-2xl shadow-card-md px-1 overflow-hidden">
            {tab === "expenses"
              ? expenses.map((e) => (
                  <TransactionItem key={e.id} transaction={{ kind: "expense", ...e }} />
                ))
              : income.map((e) => (
                  <TransactionItem key={e.id} transaction={{ kind: "income", ...e }} />
                ))}
          </div>
          {meta && (
            <p className="text-xs text-muted-foreground text-center mt-4">{countLabel}</p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">{t("historyTitle")}</h1>
        <Link href={addHref} className="flex items-center gap-1 text-xs text-primary font-semibold">
          <Plus size={14} />
          {addLabel}
        </Link>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {FilterControls}
        {TransactionList}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
        <div className="sticky top-6 self-start">
          {FilterControls}
        </div>
        <div>{TransactionList}</div>
      </div>
    </div>
  );
}
