export interface SearchExpenseResult {
  id: string;
  description: string;
  amount: number;
  date: string;
  tags: { name: string; color: string }[];
}

export interface SearchIncomeResult {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface SearchTagResult {
  id: string;
  name: string;
  color: string;
}

export interface SearchResults {
  expenses: SearchExpenseResult[];
  income: SearchIncomeResult[];
  tags: SearchTagResult[];
}
