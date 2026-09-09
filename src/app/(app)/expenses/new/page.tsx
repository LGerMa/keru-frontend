"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createExpense } from "@/hooks/use-expenses";
import { TagSelector } from "@/components/app/tag-selector";
import { PaymentMethodSelect } from "@/components/app/payment-method-select";
import { PaymentSourceSelect } from "@/components/app/payment-source-select";
import { ExpenseTypeSelect } from "@/components/app/expense-type-select";
import type { PaymentMethod, ExpenseType } from "@/lib/constants";

export default function NewExpensePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [paymentSourceId, setPaymentSourceId] = useState("");
  const [type, setType] = useState<ExpenseType>("variable");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !paymentMethod) {
      toast.error("Amount and payment method are required");
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpense({
        amount: parsed,
        paymentMethod: paymentMethod as PaymentMethod,
        date,
        description: description.trim() || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        paymentSourceId: paymentSourceId || undefined,
        type,
      });
      toast.success("Expense added");
      router.push("/expenses");
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/expenses" className="text-muted-foreground">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-base font-semibold">New expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Amount */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-xl pl-7 pr-4 py-3 text-2xl font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Payment method */}
        <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />

        {/* Payment source */}
        <PaymentSourceSelect
          value={paymentSourceId}
          onChange={setPaymentSourceId}
          onPickMethod={setPaymentMethod}
        />

        {/* Type */}
        <ExpenseTypeSelect value={type} onChange={setType} />

        {/* Tags */}
        <TagSelector selected={tagIds} onChange={setTagIds} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium mt-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save expense"}
        </button>
      </form>
    </div>
  );
}
