"use client";

import { createContext, useContext, useState } from "react";
import { currentMonth } from "@/lib/utils";

interface MonthContextValue {
  /** "YYYY-MM" */
  month: string;
  setMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextValue | null>(null);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<string>(currentMonth());

  return (
    <MonthContext.Provider value={{ month, setMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useSelectedMonth(): MonthContextValue {
  const ctx = useContext(MonthContext);
  if (!ctx) {
    throw new Error("useSelectedMonth must be used within a MonthProvider");
  }
  return ctx;
}
