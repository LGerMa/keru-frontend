const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5005";
export const API_URL = `${BASE_URL}/api`;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

export const TAG_COLORS: Record<string, { color: string; background: string }> = {
  food:          { color: "#EF4444", background: "#FEF2F2" },
  transport:     { color: "#F59E0B", background: "#FFF7ED" },
  housing:       { color: "#8B5CF6", background: "#F5F3FF" },
  subscriptions: { color: "#3B82F6", background: "#EFF6FF" },
  health:        { color: "#10B981", background: "#ECFDF5" },
  entertainment: { color: "#EC4899", background: "#FDF2F8" },
  shopping:      { color: "#F97316", background: "#FFF7ED" },
  other:         { color: "#6B7280", background: "#F9FAFB" },
};

export const PAYMENT_METHODS = [
  { value: "cash",        label: "Cash" },
  { value: "debit_card",  label: "Debit Card" },
  { value: "credit_card", label: "Credit Card" },
  { value: "transfer",    label: "Transfer" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];
