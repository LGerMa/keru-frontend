import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(parseDateOnly(date))
}

// Date-only strings ("YYYY-MM-DD") are parsed as UTC midnight by `new Date(...)`,
// which then renders as the previous day in any timezone behind UTC.
// Parse them as a local calendar date instead so the displayed day always
// matches the stored date, regardless of the viewer's timezone.
function parseDateOnly(date: string | Date): Date {
  if (date instanceof Date) return date
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (match) {
    const [, year, month, day] = match
    return new Date(Number(year), Number(month) - 1, Number(day))
  }
  return new Date(date)
}

export function formatMonth(month: string, locale = "en-US"): string {
  // month = "2026-04"
  const [year, m] = month.split("-")
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(Number(year), Number(m) - 1)
  )
}

export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}
