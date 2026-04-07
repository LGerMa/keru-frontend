import type { Tag } from "./tag";
import type { PaymentMethod } from "@/lib/constants";

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  tags: Tag[];
  date: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  tagIds: string[];
  date: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateExpenseDto {
  amount?: number;
  description?: string;
  tagIds?: string[];
  date?: string;
  paymentMethod?: PaymentMethod;
}
