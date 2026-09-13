"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  usePaymentSources,
  createPaymentSource,
  updatePaymentSource,
  deletePaymentSource,
} from "@/hooks/use-payment-sources";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/app/empty-state";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { PaymentMethod } from "@/lib/constants";
import type { PaymentSource } from "@/types/payment-source";

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#22C55E",
  "#10B981", "#3B82F6", "#8B5CF6", "#EC4899",
  "#6B7280", "#14B8A6",
];

const DEFAULT_COLOR = "#6B7280";

interface SourceFormState {
  alias: string;
  paymentMethod: PaymentMethod | "";
  color: string;
}

const DEFAULT_FORM: SourceFormState = {
  alias: "",
  paymentMethod: "",
  color: DEFAULT_COLOR,
};

export default function PaymentSourcesPage() {
  const t = useTranslations("Common");
  const { paymentSources, isLoading, error, refetch } = usePaymentSources();

  function methodLabel(method: PaymentMethod | null): string {
    return PAYMENT_METHODS.find((m) => m.value === method) ? t(`paymentMethods.${method}`) : t("noMethod");
  }

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<SourceFormState>(DEFAULT_FORM);
  const [isCreating, setIsCreating] = useState(false);

  const [editing, setEditing] = useState<PaymentSource | null>(null);
  const [editForm, setEditForm] = useState<SourceFormState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.alias.trim()) { toast.error("Alias is required"); return; }
    setIsCreating(true);
    try {
      await createPaymentSource({
        alias: createForm.alias.trim(),
        paymentMethod: createForm.paymentMethod || null,
        color: createForm.color,
      });
      refetch();
      setShowCreate(false);
      setCreateForm(DEFAULT_FORM);
      toast.success("Payment source created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create payment source");
    } finally {
      setIsCreating(false);
    }
  }

  function openEdit(source: PaymentSource) {
    setEditing(source);
    setEditForm({
      alias: source.alias,
      paymentMethod: source.paymentMethod ?? "",
      color: source.color,
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editForm.alias.trim()) { toast.error("Alias is required"); return; }
    setIsSaving(true);
    try {
      await updatePaymentSource(editing.id, {
        alias: editForm.alias.trim(),
        paymentMethod: editForm.paymentMethod || null,
        color: editForm.color,
      });
      refetch();
      setEditing(null);
      toast.success("Payment source updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update payment source");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deletePaymentSource(id);
      toast.success("Payment source deleted");
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? "Could not delete payment source");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="text-muted-foreground">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold tracking-tight">Payment sources</h1>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(DEFAULT_FORM); }}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <Plus size={14} />
          New source
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-5">
        Nickname your cards and accounts (e.g. <span className="font-medium">visa 8943</span>,{" "}
        <span className="font-medium">bac red</span>) to attribute and filter expenses by them.
      </p>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && paymentSources.length === 0 && (
        <EmptyState
          title="No payment sources yet"
          description="Add a card or account to start attributing expenses"
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="text-xs text-primary underline underline-offset-4"
            >
              Add your first source
            </button>
          }
        />
      )}

      {!isLoading && paymentSources.length > 0 && (
        <div className="flex flex-col gap-2">
          {paymentSources.map((source) => (
            <div
              key={source.id}
              className="bg-card rounded-2xl shadow-card-sm border border-border flex items-center gap-3 px-4 py-3"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: source.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: source.color }}>
                  {source.alias}
                </p>
                <p className="text-xs text-muted-foreground">
                  {methodLabel(source.paymentMethod)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEdit(source)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(source.id)}
                  disabled={deletingId === source.id}
                  className="text-destructive disabled:opacity-40"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Dialog title="New payment source" onClose={() => setShowCreate(false)}>
          <SourceForm
            form={createForm}
            onChange={setCreateForm}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isSubmitting={isCreating}
            submitLabel="Create"
          />
        </Dialog>
      )}

      {editing && (
        <Dialog title="Edit payment source" onClose={() => setEditing(null)}>
          <SourceForm
            form={editForm}
            onChange={setEditForm}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            isSubmitting={isSaving}
            submitLabel="Save"
          />
        </Dialog>
      )}
    </div>
  );
}

function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-t-2xl lg:rounded-2xl px-5 pt-5 pb-10 lg:pb-6 shadow-xl">
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4 lg:hidden" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold">{title}</p>
          <button onClick={onClose} className="text-muted-foreground p-1 -mr-1">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SourceForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  form: SourceFormState;
  onChange: (f: SourceFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const t = useTranslations("Common");
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Alias</label>
        <input
          type="text"
          placeholder="e.g. visa 8943"
          value={form.alias}
          onChange={(e) => onChange({ ...form, alias: e.target.value })}
          maxLength={100}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Payment method (optional)</label>
        <div className="flex gap-2 flex-wrap">
          {PAYMENT_METHODS.map((m) => {
            const selected = form.paymentMethod === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() =>
                  onChange({ ...form, paymentMethod: selected ? "" : m.value })
                }
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={
                  selected
                    ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", borderColor: "hsl(var(--primary))" }
                    : {}
                }
              >
                {t(`paymentMethods.${m.value}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...form, color: c })}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: c }}
            >
              {form.color === c && <Check size={12} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: form.color, backgroundColor: `${form.color}20` }}
          >
            {form.alias || "Preview"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-xl py-3 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
