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
  const t = useTranslations("PaymentSources");
  const tCommon = useTranslations("Common");
  const { paymentSources, isLoading, error, refetch } = usePaymentSources();

  function methodLabel(method: PaymentMethod | null): string {
    return PAYMENT_METHODS.find((m) => m.value === method) ? tCommon(`paymentMethods.${method}`) : tCommon("noMethod");
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
    if (!createForm.alias.trim()) { toast.error(t("aliasRequired")); return; }
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
      toast.success(t("sourceCreated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("createFailed"));
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
    if (!editForm.alias.trim()) { toast.error(t("aliasRequired")); return; }
    setIsSaving(true);
    try {
      await updatePaymentSource(editing.id, {
        alias: editForm.alias.trim(),
        paymentMethod: editForm.paymentMethod || null,
        color: editForm.color,
      });
      refetch();
      setEditing(null);
      toast.success(t("sourceUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("updateFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deletePaymentSource(id);
      toast.success(t("sourceDeleted"));
      refetch();
    } catch (err) {
      toast.error((err as Error).message ?? t("deleteFailed"));
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
          <h1 className="text-lg font-bold tracking-tight">{t("title")}</h1>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(DEFAULT_FORM); }}
          className="flex items-center gap-1 text-xs text-primary font-semibold"
        >
          <Plus size={14} />
          {t("newSource")}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-5">
        {t.rich("description", { b: (chunks) => <span className="font-medium">{chunks}</span> })}
      </p>

      {isLoading && (
        <div className="flex justify-center pt-10">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && paymentSources.length === 0 && (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="text-xs text-primary underline underline-offset-4"
            >
              {t("emptyAction")}
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
                  aria-label={t("edit")}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(source.id)}
                  disabled={deletingId === source.id}
                  className="text-destructive disabled:opacity-40"
                  aria-label={t("delete")}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Dialog title={t("newSourceDialogTitle")} onClose={() => setShowCreate(false)}>
          <SourceForm
            form={createForm}
            onChange={setCreateForm}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            isSubmitting={isCreating}
            submitLabel={t("create")}
          />
        </Dialog>
      )}

      {editing && (
        <Dialog title={t("editSourceDialogTitle")} onClose={() => setEditing(null)}>
          <SourceForm
            form={editForm}
            onChange={setEditForm}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            isSubmitting={isSaving}
            submitLabel={t("save")}
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
  const t = useTranslations("PaymentSources");
  const tCommon = useTranslations("Common");
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">{t("alias")}</label>
        <input
          type="text"
          placeholder={t("aliasPlaceholder")}
          value={form.alias}
          onChange={(e) => onChange({ ...form, alias: e.target.value })}
          maxLength={100}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">{t("paymentMethodOptional")}</label>
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
                {tCommon(`paymentMethods.${m.value}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">{t("color")}</label>
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
            {form.alias || t("preview")}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-xl py-3 text-sm font-medium"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? t("saving") : submitLabel}
        </button>
      </div>
    </form>
  );
}
