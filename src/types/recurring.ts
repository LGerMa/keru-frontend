export type RecurringEntryType = "expense" | "income";
export type RecurringFrequency = "weekly" | "biweekly" | "monthly";

export interface RecurringTag {
  id: string;
  name: string;
  color: string;
}

/** Embedded on each recurring entry (same shape as on expenses). */
export interface RecurringPaymentSource {
  id: string;
  alias: string;
  color: string;
}

export interface RecurringEntry {
  id: string;
  entryType: RecurringEntryType;
  amount: number;
  description: string | null;
  paymentMethod: string | null;
  incomeType: string | null;
  frequency: RecurringFrequency;
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  nextDate: string;
  isActive: boolean;
  tags: RecurringTag[];
  paymentSource: RecurringPaymentSource | null;
  createdAt: string;
}

export interface CreateRecurringDto {
  entryType: RecurringEntryType;
  amount: number;
  frequency: RecurringFrequency;
  nextDate: string;
  description?: string;
  paymentMethod?: string;
  incomeType?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  tagIds?: string[];
  /** UUID of a payment source; expense entries only. */
  paymentSourceId?: string | null;
}

export interface UpdateRecurringDto {
  entryType?: RecurringEntryType;
  amount?: number;
  frequency?: RecurringFrequency;
  nextDate?: string;
  description?: string;
  paymentMethod?: string;
  incomeType?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  tagIds?: string[];
  /** Send `null` explicitly to clear an existing source. Omit to leave unchanged. */
  paymentSourceId?: string | null;
}
