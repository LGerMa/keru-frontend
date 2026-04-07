"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getIncome, updateIncome, deleteIncome } from "@/hooks/use-income";
import { TagSelector } from "@/components/app/tag-selector";
import { IncomeTypeSelect } from "@/components/app/income-type-select";
import { TagPill } from "@/components/app/tag-pill";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Income, UpdateIncomeDto, IncomeType } from "@/types/income";

const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  fixed_monthly: "Monthly",
  fixed_biweekly: "Biweekly",
  sporadic: "Sporadic",
};

export default function IncomeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<Income | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<IncomeType | "">("");
  const [tagIds, setTagIds] = useState<string[]>([]);

  useEffect(() => {
    getIncome(id)
      .then((e) => {
        setEntry(e);
        setAmount(String(e.amount));
        setDescription(e.description ?? "");
        setDate(e.date.slice(0, 10));
        setType(e.type);
        setTagIds(e.tags.map((t) => t.id));
      })
      .catch(() => toast.error("Could not load income"))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!entry) return;
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setIsSubmitting(true);
    try {
      const dto: UpdateIncomeDto = {
        amount: parsed,
        type: type as IncomeType,
        date,
        description: description.trim() || undefined,
        tagIds,
      };
      const updated = await updateIncome(id, dto);
      setEntry(updated);
      setIsEditing(false);
      toast.success("Income updated");
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this income entry?")) return;
    try {
      await deleteIncome(id);
      toast.success("Income deleted");
      router.push("/income");
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

  if (!entry) {
    return (
      <div className="pt-6">
        <p className="text-sm text-destructive">Income entry not found.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/income" className="text-muted-foreground">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-base font-semibold">Income</h1>
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
            <p className="text-3xl font-medium text-[#22C55E]">
              +{formatCurrency(entry.amount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.date)}</p>
          </div>

          {entry.description && (
            <p className="text-sm">{entry.description}</p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {INCOME_TYPE_LABELS[entry.type]}
            </span>
            {entry.source === "whatsapp" && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">WhatsApp</span>
            )}
          </div>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
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
                className="w-full border rounded-xl pl-7 pr-4 py-3 text-2xl font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>

          <IncomeTypeSelect value={type} onChange={setType} />
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
              className="flex-1 rounded-xl py-3 text-sm font-medium disabled:opacity-50 text-white"
              style={{ backgroundColor: "#22C55E" }}
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
