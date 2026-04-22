export type RecurringEntryType = "expense" | "income";
export type RecurringFrequency = "weekly" | "biweekly" | "monthly";

export interface RecurringTag {
  id: string;
  name: string;
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
}
