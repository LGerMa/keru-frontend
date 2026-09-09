"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getExpense, updateExpense, deleteExpense } from "@/hooks/use-expenses";
import { TagSelector } from "@/components/app/tag-selector";
import { PaymentMethodSelect } from "@/components/app/payment-method-select";
import { PaymentSourceSelect } from "@/components/app/payment-source-select";
import { ExpenseTypeSelect } from "@/components/app/expense-type-select";
import { TagPill } from "@/components/app/tag-pill";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense, UpdateExpenseDto } from "@/types/expense";
import { EXPENSE_TYPES } from "@/lib/constants";
import type { PaymentMethod, ExpenseType } from "@/lib/constants";

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [paymentSourceId, setPaymentSourceId] = useState("");
  const [type, setType] = useState<ExpenseType>("variable");
  const [tagIds, setTagIds] = useState<string[]>([]);

  useEffect(() => {
    getExpense(id)
      .then((e) => {
        setExpense(e);
        setAmount(String(e.amount));
        setDescription(e.description ?? "");
        setDate(e.date.slice(0, 10));
        setPaymentMethod(e.paymentMethod);
        setPaymentSourceId(e.paymentSource?.id ?? "");
        setType(e.type);
        setTagIds(e.tags.map((t) => t.id));
      })
      .catch(() => toast.error("Could not load expense"))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!expense) return;
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setIsSubmitting(true);
    try {
      const dto: UpdateExpenseDto = {
        amount: parsed,
        paymentMethod: paymentMethod as PaymentMethod,
        date,
        description: description.trim() || undefined,
        tagIds,
        paymentSourceId: paymentSourceId || null,
        type,
      };
      const updated = await updateExpense(id, dto);
      setExpense(updated);
      setIsEditing(false);
      toast.success("Expense updated");
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      router.push("/expenses");
    } catch (err) {
      toast.error((err as Error).message ?? "Could not delete");
    }
  }

  if (isLoading) {
    return (
      <div className="pt-6 flex justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="pt-6">
        <p className="text-sm text-destructive">Expense not found.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/expenses" className="text-muted-foreground">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-base font-semibold">Expense</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-muted-foreground">
              <Pencil size={18} />
            </button>
          )}
          <button onClick={handleDelete} className="text-destructive">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!isEditing ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-3xl font-medium">{formatCurrency(expense.amount)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(expense.date)}</p>
          </div>

          {expense.description && (
            <p className="text-sm">{expense.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground capitalize">
              {expense.paymentMethod.replace("_", " ")}
            </span>
            <span className="text-xs text-muted-foreground">
              {EXPENSE_TYPES.find((t) => t.value === expense.type)?.label ?? expense.type}
            </span>
            {expense.paymentSource && (
              <span
                className="inline-flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 font-medium"
                style={{
                  color: expense.paymentSource.color,
                  backgroundColor: `${expense.paymentSource.color}20`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: expense.paymentSource.color }}
                />
                {expense.paymentSource.alias}
              </span>
            )}
            {expense.source === "whatsapp" && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">WhatsApp</span>
            )}
          </div>

          {expense.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {expense.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-xl pl-7 pr-4 py-3 text-2xl font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
          <PaymentSourceSelect
            value={paymentSourceId}
            onChange={setPaymentSourceId}
            onPickMethod={setPaymentMethod}
          />
          <ExpenseTypeSelect value={type} onChange={setType} />
          <TagSelector selected={tagIds} onChange={setTagIds} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 border rounded-xl py-3 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
