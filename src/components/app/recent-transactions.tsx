import Link from "next/link";
import { TransactionItem } from "./transaction-item";
import type { Expense } from "@/types/expense";

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">Recent</p>
        <Link href="/expenses" className="text-xs text-muted-foreground underline underline-offset-4">
          See all
        </Link>
      </div>
      {expenses.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No transactions yet
        </p>
      ) : (
        <div>
          {expenses.map((expense) => (
            <TransactionItem
              key={expense.id}
              transaction={{ kind: "expense", ...expense }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
