import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";

type Transaction =
  | ({ kind: "expense" } & Expense)
  | ({ kind: "income" } & Income);

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.kind === "expense";
  const href = isExpense
    ? `/expenses/${transaction.id}`
    : `/income/${transaction.id}`;
  const primaryTag = transaction.tags[0];
  const description = transaction.description ?? (isExpense ? "Expense" : "Income");
  const badgeLetter = description[0]?.toUpperCase() ?? (isExpense ? "E" : "I");
  const badgeBg = isExpense ? "rgba(99,102,241,0.10)" : "rgba(34,197,94,0.12)";
  const badgeColor = isExpense ? "#6366f1" : "#22C55E";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/40 transition-colors -mx-1 px-1 rounded-lg"
    >
      {/* Icon badge */}
      <div
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-[10px] text-sm font-bold"
        style={{ backgroundColor: primaryTag ? `${primaryTag.color}18` : badgeBg, color: primaryTag?.color ?? badgeColor }}
      >
        {badgeLetter}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(transaction.date, { month: "short", day: "numeric" })}
          {primaryTag && <span> · {primaryTag.name}</span>}
        </p>
      </div>

      <p className={`text-sm font-bold flex-shrink-0 ${isExpense ? "text-foreground" : "text-[#22C55E]"}`}>
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount)}
      </p>
    </Link>
  );
}
