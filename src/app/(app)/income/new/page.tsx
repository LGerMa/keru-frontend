"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createIncome } from "@/hooks/use-income";
import { TagSelector } from "@/components/app/tag-selector";
import { IncomeTypeSelect } from "@/components/app/income-type-select";
import type { IncomeType } from "@/types/income";

export default function NewIncomePage() {
  const t = useTranslations("Income");
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<IncomeType | "">("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !type) {
      toast.error(t("amountAndTypeRequired"));
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error(t("invalidAmount"));
      return;
    }

    setIsSubmitting(true);
    try {
      await createIncome({
        amount: parsed,
        type: type as IncomeType,
        date,
        description: description.trim() || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      });
      toast.success(t("incomeAdded"));
      router.push("/income");
    } catch (err) {
      toast.error((err as Error).message ?? t("somethingWentWrong"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/income" className="text-muted-foreground">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-base font-semibold">{t("newIncome")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Amount */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("amount")}</label>
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
              className="w-full border rounded-xl pl-7 pr-4 py-3 text-2xl font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              autoFocus
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("description")}</label>
          <input
            type="text"
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("date")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
        </div>

        {/* Type */}
        <IncomeTypeSelect value={type} onChange={setType} />

        {/* Tags */}
        <TagSelector selected={tagIds} onChange={setTagIds} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3 text-sm font-medium mt-2 disabled:opacity-50 text-white"
          style={{ backgroundColor: "#22C55E" }}
        >
          {isSubmitting ? t("saving") : t("saveIncome")}
        </button>
      </form>
    </div>
  );
}
