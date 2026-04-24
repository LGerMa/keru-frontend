"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useDashboard } from "@/hooks/use-dashboard";
import { useBudgetStatus } from "@/hooks/use-budgets";
import { useRecurring } from "@/hooks/use-recurring";
import { useInsights } from "@/hooks/use-insights";
import { useBalanceDelta } from "@/hooks/use-balance-delta";
import { HeroCard } from "@/components/app/hero-card";
import { QuickStats } from "@/components/app/quick-stats";
import { CategoryDonut } from "@/components/app/category-donut";
import { BudgetOverview } from "@/components/app/budget-overview";
import { TrendsChart } from "@/components/app/trends-chart";
import { TransactionsTable } from "@/components/app/transactions-table";
import { RecurringWatchlist } from "@/components/app/recurring-watchlist";
import { formatCurrency, formatMonth, currentMonth } from "@/lib/utils";
import { TrendingUp, Plus } from "lucide-react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Section header ──────────────────────────────────────────
function SectionHeader({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {action}
    </div>
  );
}

// ── Card wrapper ────────────────────────────────────────────
function Card({
  children,
  flush = false,
}: {
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <div className="bg-card rounded-[22px] border border-border shadow-card-md overflow-hidden">
      <div className={flush ? "" : "p-5"}>{children}</div>
    </div>
  );
}

// ── Skeleton loader ─────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
  );
}

function DashboardSkeleton() {
  return (
    <div className="pt-6 space-y-5">
      <Skeleton className="h-[170px] rounded-[28px]" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-[18px]" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[280px] rounded-[22px]" />
        <Skeleton className="h-[280px] rounded-[22px]" />
      </div>
      <Skeleton className="h-[220px] rounded-[22px]" />
      <Skeleton className="h-[340px] rounded-[22px]" />
      <Skeleton className="h-[260px] rounded-[22px]" />
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const month = currentMonth();

  const {
    summary,
    tagBreakdowns,
    trends,
    recentExpenses,
    isLoading,
    error,
  } = useDashboard(month);

  const { statuses: budgetStatuses } = useBudgetStatus();
  const { entries: recurringEntries } = useRecurring();

  const insights = useInsights({ summary, tagBreakdowns });
  const { balanceDelta } = useBalanceDelta(trends, month);

  const firstName = user?.profile?.name?.split(" ")[0] ?? "";

  // ── Loading ──
  if (isLoading) return <DashboardSkeleton />;

  // ── Error ──
  if (error) {
    return (
      <div className="pt-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-24 lg:pb-12">

      {/* ── Page header ── */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Where&apos;s your money going?
        </h1>
      </div>

      {/* ── Mobile: quick-add buttons (below hero on mobile) ── */}
      <div className="flex gap-3 mb-5 lg:hidden">
        <Link
          href="/expenses/new"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-colored"
        >
          <Plus size={15} />
          Expense
        </Link>
        <Link
          href="/income/new"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-card text-foreground text-sm font-semibold border border-border shadow-card-sm"
        >
          <TrendingUp size={15} />
          Income
        </Link>
      </div>

      {/* ① Hero balance card */}
      {summary && (
        <HeroCard
          summary={summary}
          trends={trends}
          balanceDelta={balanceDelta}
        />
      )}

      {/* ② Quick stats strip (desktop only — too wide for mobile) */}
      {summary && insights && (
        <div className="hidden lg:block">
          <QuickStats
            summary={summary}
            tagBreakdowns={tagBreakdowns}
            expenseCount={summary.expenseCount}
            daysIntoMonth={insights.daysIntoMonth}
          />
        </div>
      )}

      {/* ③ Where it went — category donut + budgets side by side */}
      {(tagBreakdowns.length > 0 || budgetStatuses.length > 0) && (
        <>
          <SectionHeader
            label={`Where it went · ${summary ? formatMonth(summary.month) : ""}`}
            action={
              <Link
                href="/tags"
                className="text-xs font-semibold text-primary"
              >
                Manage tags →
              </Link>
            }
          />
          <div className="grid lg:grid-cols-2 gap-4 mb-6">
            {tagBreakdowns.length > 0 && (
              <Card>
                <p className="text-sm font-bold mb-1">Category breakdown</p>
                <p className="text-xs text-muted-foreground mb-4">
                  How your spending is distributed
                </p>
                <CategoryDonut breakdowns={tagBreakdowns} />
              </Card>
            )}
            {budgetStatuses.length > 0 && (
              <Card>
                <p className="text-sm font-bold mb-1">Budgets</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Progress toward your {summary ? formatMonth(summary.month) : ""} limits
                </p>
                <BudgetOverview statuses={budgetStatuses} />
              </Card>
            )}
          </div>
        </>
      )}

      {/* ④ Spending trend */}
      {trends.length > 1 && (
        <>
          <SectionHeader
            label="Spending trend · last 6 months"
            action={
              <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-0.5 rounded inline-block"
                    style={{ background: "#6366f1" }}
                  />
                  Expenses
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 inline-block"
                    style={{ borderTop: "2px dashed #22C55E" }}
                  />
                  Income
                </span>
              </div>
            }
          />
          <Card>
            <TrendsChart trends={trends} />
          </Card>
          <div className="mb-6" />
        </>
      )}

      {/* ⑤ Recent transactions — sortable table (desktop) / list (mobile) */}
      {recentExpenses.length > 0 && (
        <>
          <SectionHeader
            label="Transactions"
            action={
              <Link
                href="/expenses"
                className="text-xs font-semibold text-primary"
              >
                All transactions →
              </Link>
            }
          />
          {/* Desktop: sortable table */}
          <div className="hidden lg:block mb-6">
            <Card flush>
              <TransactionsTable expenses={recentExpenses} pageSize={8} />
            </Card>
          </div>
          {/* Mobile: simple list (existing component) */}
          <div className="lg:hidden mb-5">
            <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden px-1">
              {recentExpenses.map((expense) => {
                const primaryTag = expense.tags[0];
                const description = expense.description ?? "Expense";
                return (
                  <Link
                    key={expense.id}
                    href={`/expenses/${expense.id}`}
                    className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/40 transition-colors px-2 rounded-lg"
                  >
                    <div
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-[10px] text-sm font-bold"
                      style={{
                        backgroundColor: primaryTag
                          ? primaryTag.color + "18"
                          : "rgba(99,102,241,0.10)",
                        color: primaryTag?.color ?? "#6366f1",
                      }}
                    >
                      {description[0]?.toUpperCase() ?? "E"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(expense.date))}
                        {primaryTag && <span> · {primaryTag.name}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0 text-foreground">
                      -{formatCurrency(expense.amount)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ⑥ Recurring watchlist */}
      {recurringEntries.length > 0 && (
        <>
          <SectionHeader
            label="Recurring · upcoming"
            action={
              <Link
                href="/recurring"
                className="text-xs font-semibold text-primary"
              >
                Manage →
              </Link>
            }
          />
          <Card>
            <RecurringWatchlist entries={recurringEntries} limit={6} />
          </Card>
        </>
      )}

    </div>
  );
}
