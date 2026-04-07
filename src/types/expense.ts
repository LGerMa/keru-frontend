import type { PaymentMethod } from "@/lib/constants";

export interface ExpenseTag {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
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
}

export interface UpdateExpenseDto {
  amount?: number;
  paymentMethod?: PaymentMethod;
  date?: string;
  description?: string;
  tagIds?: string[];
  receiptUrl?: string;
}
