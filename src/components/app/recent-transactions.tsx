import Link from "next/link";
import { TransactionItem } from "./transaction-item";
import type { Expense } from "@/types/expense";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Recent</p>
        <Link href="/expenses" className="text-xs text-primary font-semibold">
          See all
        </Link>
      </div>
      <div className="bg-card rounded-2xl shadow-card-md overflow-hidden px-1">
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet</p>
        ) : (
          expenses.map((expense) => (
            <TransactionItem
              key={expense.id}
              transaction={{ kind: "expense", ...expense }}
            />
          ))
        )}
      </div>
    </div>
  );
}
