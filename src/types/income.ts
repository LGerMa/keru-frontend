export type IncomeType = "fixed_monthly" | "fixed_biweekly" | "sporadic";

export interface IncomeTag {
  id: string;
  name: string;
  color: string;
}

export interface Income {
  id: string;
  amount: number;
  type: IncomeType;
  description: string | null;
  date: string;
  source: "web" | "whatsapp";
  receiptUrl: string | null;
  tags: IncomeTag[];
  createdAt: string;
}

export interface CreateIncomeDto {
  amount: number;
  type: IncomeType;
  date: string;
  description?: string;
  tagIds?: string[];
  receiptUrl?: string;
}

export interface UpdateIncomeDto {
  amount?: number;
  type?: IncomeType;
  date?: string;
  description?: string;
  tagIds?: string[];
  receiptUrl?: string;
}
