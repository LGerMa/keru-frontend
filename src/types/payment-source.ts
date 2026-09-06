import type { PaymentMethod } from "@/lib/constants";

export interface PaymentSource {
  id: string;
  alias: string;
  paymentMethod: PaymentMethod | null;
  color: string; // hex, e.g. "#3B82F6"; defaults to "#6B7280"
  createdAt: string;
}

/** Embedded on each expense in list/detail responses. */
export interface ExpensePaymentSource {
  id: string;
  alias: string;
  color: string;
}

export interface CreatePaymentSourceDto {
  alias: string;
  paymentMethod?: PaymentMethod | null;
  color?: string;
}

export interface UpdatePaymentSourceDto {
  alias?: string;
  paymentMethod?: PaymentMethod | null;
  color?: string;
}
