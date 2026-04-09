import type { Tag } from "@/types/tag";

export interface Budget {
  id: string;
  tag: Tag;
  amount: number;
  createdAt: string;
}

export interface BudgetStatus {
  tag: Tag;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "normal" | "warning" | "over";
}

export interface CreateBudgetDto {
  tagId: string;
  amount: number;
}

export interface UpdateBudgetDto {
  amount: number;
}
