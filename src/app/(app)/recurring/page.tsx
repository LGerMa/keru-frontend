"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Pause, Play, X } from "lucide-react";
import { toast } from "sonner";
import {
  useRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  pauseRecurring,
  resumeRecurring,
} from "@/hooks/use-recurring";
import { TagSelector } from "@/components/app/tag-selector";
import { PaymentMethodSelect } from "@/components/app/payment-method-select";
import { PaymentSourceSelect } from "@/components/app/payment-source-select";
import { IncomeTypeSelect } from "@/components/app/income-type-select";
import { EmptyState } from "@/components/app/empty-state";
import { formatCurrency } from "@/lib/utils";
import type { RecurringEntry, RecurringFrequency, RecurringEntryType, CreateRecurringDto } from "@/types/recurring";
import type { PaymentMethod } from "@/lib/constants";
import type { IncomeType } from "@/types/income";

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: "weekly",   label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly",  label: "Monthly" },
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

interface FormState {
  entryType: RecurringEntryType;
  amount: string;
  description: string;
  frequency: RecurringFrequency;
  dayOfMonth: string;
  dayOfWeek: string;
  nextDate: string;
  paymentMethod: PaymentMethod | "";
  paymentSourceId: string;
  incomeType: IncomeType | "";
  tagIds: string[];
}

const DEFAULT_FORM: FormState = {
  entryType: "expense",
  amount: "",
  description: "",
  frequency: "monthly",
  dayOfMonth: "1",
  dayOfWeek: "1",
  nextDate: new Date().toISOString().slice(0, 10),
  paymentMethod: "",
  paymentSourceId: "",
  incomeType: "",
  tagIds: [],
};

function frequencyLabel(f: RecurringFrequency): string {
  return FREQUENCIES.find((x) => x.value === f)?.label ?? f;
}

function nextDateLabel(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecurringPage() {
  const { entries, isLoading, error, refetch } = useRecurring();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RecurringEntry | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openCreate() {
    setEditingEntry(null);
    setForm(DEFAULT_FORM);
    setShowForm(true);
  }

  function openEdit(entry: RecurringEntry) {
    setEditingEntry(entry);
    setForm({
      entryType: entry.entryType,
      amount: String(entry.amount),
      description: entry.description ?? "",
      frequency: entry.frequency,
      dayOfMonth: entry.dayOfMonth !== null && entry.dayOfMonth !== undefined ? String(entry.dayOfMonth) : "1",
      dayOfWeek: entry.dayOfWeek !== null && entry.dayOfWeek !== undefined ? String(entry.dayOfWeek) : "1",
      nextDate: entry.nextDate,
      paymentMethod: (entry.paymentMethod ?? "") as PaymentMethod | "",
      paymentSourceId: entry.paymentSource?.id ?? "",
      incomeType: (entry.incomeType ?? "") as IncomeType | "",
      tagIds: entry.tags.map((t) => t.id),
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const parsed = Number.parseFloat(form.amount);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!form.nextDate) {
      toast.error("Next date is required");
      return;
    }

    const dto: CreateRecurringDto = {
      entryType: form.entryType,
      amount: parsed,
      frequency: form.frequency,
      nextDate: form.nextDate,
      description: form.description.trim() || undefined,
      tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
    };

    if (form.entryType === "expense" && form.paymentMethod) {
      dto.paymentMethod = form.paymentMethod;
    } else if (form.entryType === "income" && form.incomeType) {
      dto.incomeType = form.incomeType;
    }

    if (form.entryType === "expense") {
      // On edit, send null explicitly to clear an existing source.
      if (form.paymentSourceId) dto.paymentSourceId = form.paymentSourceId;
      else if (editingEntry) dto.paymentSourceId = null;
    }

    if (form.frequency === "monthly" && form.dayOfMonth) {
      const dom = Number.parseInt(form.dayOfMonth);
      if (!Number.isNaN(dom)) dto.dayOfMonth = dom;
    }
    if ((form.frequency === "weekly" || form.frequency === "biweekly") && form.dayOfWeek !== "") {
      const dow = Number.parseInt(form.dayOfWeek);
      if (!Number.isNaN(dow)) dto.dayOfWeek = dow;
    }

    setIsSubmitting(true);
    try {
      if (editingEntry) {
        await updateRecurring(editingEntry.id, dto);
        toast.success("Updated");
      } else {
        await createRecurring(dto);
        toast.success("Recurring entry created");
      }
      refetch();
      setShowForm(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteRecurring(id);
      toast.success("Deleted");
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not delete");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(entry: RecurringEntry) {
    setTogglingId(entry.id);
    try {
      if (entry.isActive) {
        await pauseRecurring(entry.id);
        toast.success("Paused");
      } else {
        await resumeRecurring(entry.id);
        toast.success("Resumed");
      }
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not update");
    } finally {
      setTogglingId(null);
    }
  }

  const expenses = entries.filter((e) => e.entryType === "expense");
  const incomes = entries.filter((e) => e.entryType === "income");

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">Recurring</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <Plus size={14} />
          New
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          title="No recurring entries"
          description="Set up recurring expenses or income that repeat automatically"
          action={
            <button
              onClick={openCreate}
              className="text-xs text-primary underline underline-offset-4"
            >
              Create your first recurring entry
            </button>
          }
        />
      )}

      {!isLoading && entries.length > 0 && (
        <div className="flex flex-col gap-5">
          {expenses.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                Expenses
              </p>
              <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
                {expenses.map((entry, i) => (
                  <RecurringItem
                    key={entry.id}
                    entry={entry}
                    isLast={i === expenses.length - 1}
                    isDeleting={deletingId === entry.id}
                    isToggling={togglingId === entry.id}
                    onEdit={() => openEdit(entry)}
                    onDelete={() => handleDelete(entry.id)}
                    onToggle={() => handleToggle(entry)}
                  />
                ))}
              </div>
            </section>
          )}

          {incomes.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                Income
              </p>
              <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
                {incomes.map((entry, i) => (
                  <RecurringItem
                    key={entry.id}
                    entry={entry}
                    isLast={i === incomes.length - 1}
                    isDeleting={deletingId === entry.id}
                    isToggling={togglingId === entry.id}
                    onEdit={() => openEdit(entry)}
                    onDelete={() => handleDelete(entry.id)}
                    onToggle={() => handleToggle(entry)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {showForm && (
        <FormSheet
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          isSubmitting={isSubmitting}
          isEdit={!!editingEntry}
        />
      )}
    </div>
  );
}

// ── Recurring list item ──────────────────────────────────────────────────────

interface RecurringItemProps {
  readonly entry: RecurringEntry;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly isToggling: boolean;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onToggle: () => void;
}

function RecurringItem({ entry, isLast, isDeleting, isToggling, onEdit, onDelete, onToggle }: RecurringItemProps) {
  const tagColor = entry.tags[0]?.color;
  const isIncome = entry.entryType === "income";

  return (
    <div className={`px-4 py-3 flex items-center gap-3 ${isLast ? "" : "border-b border-border"}`}>
      {/* Color dot or fallback */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: tagColor ?? "#6B7280" }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold ${entry.isActive ? "text-foreground" : "text-muted-foreground line-through"}`}>
            {entry.description || `${frequencyLabel(entry.frequency)} ${entry.entryType}`}
          </span>
          {!entry.isActive && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              Paused
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground">{frequencyLabel(entry.frequency)}</span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground">Next: {nextDateLabel(entry.nextDate)}</span>
          {entry.paymentSource && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                color: entry.paymentSource.color,
                backgroundColor: `${entry.paymentSource.color}20`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: entry.paymentSource.color }}
              />
              {entry.paymentSource.alias}
            </span>
          )}
        </div>
      </div>

      <span
        className="text-sm font-bold shrink-0"
        style={{ color: isIncome ? "#22C55E" : undefined }}
      >
        {isIncome ? "+" : "-"}{formatCurrency(entry.amount)}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggle}
          disabled={isToggling}
          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          aria-label={entry.isActive ? "Pause" : "Resume"}
        >
          {entry.isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="text-destructive disabled:opacity-40"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Create / Edit form sheet ─────────────────────────────────────────────────

interface FormSheetProps {
  readonly form: FormState;
  readonly onChange: React.Dispatch<React.SetStateAction<FormState>>;
  readonly onSubmit: (e: React.SyntheticEvent) => void;
  readonly onClose: () => void;
  readonly isSubmitting: boolean;
  readonly isEdit: boolean;
}

function FormSheet({ form, onChange, onSubmit, onClose, isSubmitting, isEdit }: FormSheetProps) {
  // Functional update — two set() calls in one click (e.g. picking a payment
  // source that also fills the payment method) must not clobber each other.
  const set = (partial: Partial<FormState>) => onChange((prev) => ({ ...prev, ...partial }));

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/50 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-t-2xl px-5 pt-5 pb-10 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold">{isEdit ? "Edit recurring" : "New recurring"}</p>
          <button onClick={onClose} className="text-muted-foreground p-1 -mr-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Entry type */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Type</p>
            <div className="flex gap-1 bg-muted rounded-xl p-1">
              {(["expense", "income"] as RecurringEntryType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set({ entryType: t })}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors capitalize"
                  style={
                    form.entryType !== t
                      ? {}
                      : t === "income"
                        ? { backgroundColor: "#22C55E", color: "#fff" }
                        : { backgroundColor: "oklch(0.585 0.233 277)", color: "#fff" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="rec-amount" className="text-xs text-muted-foreground mb-1 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                id="rec-amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set({ amount: e.target.value })}
                className="w-full border rounded-xl pl-7 pr-4 py-3 text-xl font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="rec-description" className="text-xs text-muted-foreground mb-1 block">Description (optional)</label>
            <input
              id="rec-description"
              type="text"
              placeholder={form.entryType === "expense" ? "e.g. Netflix" : "e.g. Monthly salary"}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Frequency */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Frequency</p>
            <div className="flex gap-2 flex-wrap">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => set({ frequency: f.value })}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    form.frequency === f.value
                      ? { backgroundColor: "oklch(0.585 0.233 277)", color: "#fff", borderColor: "oklch(0.585 0.233 277)" }
                      : {}
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day of month — only for monthly */}
          {form.frequency === "monthly" && (
            <div>
              <label htmlFor="rec-day-month" className="text-xs text-muted-foreground mb-1 block">Day of month (1–28)</label>
              <input
                id="rec-day-month"
                type="number"
                min="1"
                max="28"
                value={form.dayOfMonth}
                onChange={(e) => set({ dayOfMonth: e.target.value })}
                className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Day of week — for weekly / biweekly */}
          {(form.frequency === "weekly" || form.frequency === "biweekly") && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Day of week</p>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS_OF_WEEK.map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => set({ dayOfWeek: String(idx) })}
                    className="px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
                    style={
                      form.dayOfWeek === String(idx)
                        ? { backgroundColor: "oklch(0.585 0.233 277)", color: "#fff", borderColor: "oklch(0.585 0.233 277)" }
                        : {}
                    }
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next date */}
          <div>
            <label htmlFor="rec-next-date" className="text-xs text-muted-foreground mb-1 block">Next date</label>
            <input
              id="rec-next-date"
              type="date"
              value={form.nextDate}
              onChange={(e) => set({ nextDate: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Payment method + source (expense only) */}
          {form.entryType === "expense" && (
            <>
              <PaymentMethodSelect
                value={form.paymentMethod}
                onChange={(v) => set({ paymentMethod: v })}
              />
              <PaymentSourceSelect
                value={form.paymentSourceId}
                onChange={(v) => set({ paymentSourceId: v })}
                onPickMethod={(m) => set({ paymentMethod: m })}
              />
            </>
          )}

          {/* Income type (income only) */}
          {form.entryType === "income" && (
            <IncomeTypeSelect
              value={form.incomeType}
              onChange={(v) => set({ incomeType: v })}
            />
          )}

          {/* Tags */}
          <TagSelector selected={form.tagIds} onChange={(ids) => set({ tagIds: ids })} />

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-xl py-3 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {isSubmitting ? "Saving…" : isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

