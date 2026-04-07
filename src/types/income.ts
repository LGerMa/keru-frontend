import type { Tag } from "./tag";

export interface Income {
  id: string;
  amount: number;
  description?: string;
  tags: Tag[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeDto {
  amount: number;
  description?: string;
  tagIds: string[];
  date: string;
}

export interface UpdateIncomeDto {
  amount?: number;
  description?: string;
  tagIds?: string[];
  date?: string;
}
