import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TagPill } from "./tag-pill";
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

  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 border-b last:border-0"
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: primaryTag?.color ?? "#6B7280" }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">
          {transaction.description ?? (isExpense ? "Expense" : "Income")}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {transaction.tags.map((tag) => (
            <TagPill key={tag.id} tag={tag} size="sm" />
          ))}
          {isExpense && (
            <span className="text-xs text-muted-foreground">
              · {(transaction as Expense).paymentMethod.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-medium ${
            isExpense ? "text-foreground" : "text-[#22C55E]"
          }`}
        >
          {isExpense ? "-" : "+"}
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(transaction.date, { month: "short", day: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
