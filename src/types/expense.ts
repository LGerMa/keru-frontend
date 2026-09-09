import type { PaymentMethod, ExpenseType } from "@/lib/constants";
import type { ExpensePaymentSource } from "@/types/payment-source";

export interface ExpenseTag {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentSource: ExpensePaymentSource | null;
  /** Budgeting classification. Never null — "variable" if it was never set. */
  type: ExpenseType;
  description: string | null;
  date: string;
  source: "web" | "whatsapp";
  receiptUrl: string | null;
  tags: ExpenseTag[];
  createdAt: string;
}

export interface CreateExpenseDto {
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  description?: string;
  tagIds?: string[];
  receiptUrl?: string;
  paymentSourceId?: string | null;
  /** Omit to default to "variable". */
  type?: ExpenseType;
}

export interface UpdateExpenseDto {
  amount?: number;
  paymentMethod?: PaymentMethod;
  date?: string;
  description?: string;
  tagIds?: string[];
  receiptUrl?: string;
  /** Send `null` explicitly to clear an existing attribution. Omit to leave unchanged. */
  paymentSourceId?: string | null;
  type?: ExpenseType;
}
