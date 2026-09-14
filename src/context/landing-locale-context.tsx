"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";

export type LandingLocale = "es" | "en";

const STORAGE_KEY = "keru-lang";
const DEFAULT_LOCALE: LandingLocale = "es";

const DICTIONARIES: Record<LandingLocale, unknown> = {
  en: enMessages,
  es: esMessages,
};

function isLandingLocale(value: string | null | undefined): value is LandingLocale {
  return value === "es" || value === "en";
}

function resolveInitialLocale(queryLang: string | null): LandingLocale {
  if (isLandingLocale(queryLang)) return queryLang;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLandingLocale(stored)) return stored;
  }
  return DEFAULT_LOCALE;
}

function lookup(dict: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

interface LandingLocaleContextValue {
  locale: LandingLocale;
  setLocale: (next: LandingLocale) => void;
  t: (key: string) => string;
  rich: (
    key: string,
    tags: {
      em?: (chunk: ReactNode) => ReactNode;
      strong?: (chunk: ReactNode) => ReactNode;
    }
  ) => ReactNode;
}

const LandingLocaleContext = createContext<LandingLocaleContextValue | null>(null);

const NAMESPACE_ROOTS = ["Landing", "LandingNav", "LandingFooter", "Pricing"] as const;
type NamespaceRoot = (typeof NAMESPACE_ROOTS)[number];

function resolveNamespacedKey(dict: unknown, key: string): string | undefined {
  const [firstSegment] = key.split(".");
  const explicitRoot = (NAMESPACE_ROOTS as readonly string[]).includes(firstSegment)
    ? (firstSegment as NamespaceRoot)
    : "Landing";
  const path = explicitRoot === firstSegment ? key.slice(firstSegment.length + 1) : key;
  return lookup((dict as Record<string, unknown>)[explicitRoot], path);
}

export function LandingLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LandingLocale>(() => resolveInitialLocale(null));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: LandingLocale) => {
    setLocaleState(next);
  }, []);

  const dict = DICTIONARIES[locale];

  const t = useCallback(
    (key: string) => resolveNamespacedKey(dict, key) ?? key,
    [dict]
  );

  const rich = useCallback(
    (
      key: string,
      tags: {
        em?: (chunk: ReactNode) => ReactNode;
        strong?: (chunk: ReactNode) => ReactNode;
      }
    ): ReactNode => {
      const raw = resolveNamespacedKey(dict, key) ?? key;
      const parts = raw.split(/(<em>.*?<\/em>|<strong>.*?<\/strong>)/g);
      return parts.map((part, index) => {
        const emMatch = part.match(/^<em>(.*?)<\/em>$/);
        if (emMatch && tags.em) return <span key={index}>{tags.em(emMatch[1])}</span>;
        const strongMatch = part.match(/^<strong>(.*?)<\/strong>$/);
        if (strongMatch && tags.strong) return <span key={index}>{tags.strong(strongMatch[1])}</span>;
        return <span key={index}>{part}</span>;
      });
    },
    [dict]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, rich }),
    [locale, setLocale, t, rich]
  );

  return (
    <LandingLocaleContext.Provider value={value}>
      <Suspense fallback={null}>
        <QueryLangSync />
      </Suspense>
      {children}
    </LandingLocaleContext.Provider>
  );
}

function QueryLangSync() {
  const ctx = useContext(LandingLocaleContext);
  const searchParams = useSearchParams();
  const queryLang = searchParams.get("lang");

  useEffect(() => {
    if (!ctx) return;
    if (isLandingLocale(queryLang) && queryLang !== ctx.locale) {
      ctx.setLocale(queryLang);
    }
  }, [queryLang, ctx]);

  return null;
}

export function useLandingT() {
  const ctx = useContext(LandingLocaleContext);
  if (!ctx) {
    throw new Error("useLandingT must be used within LandingLocaleProvider");
  }
  return ctx;
}

export function useLandingMonths(): string[] {
  const { locale } = useLandingT();
  const dict = DICTIONARIES[locale] as { Landing?: { gallery?: { months?: string[] } } };
  return dict.Landing?.gallery?.months ?? [];
}

export function useLandingList(key: string): string[] {
  const { locale } = useLandingT();
  const dict = DICTIONARIES[locale];
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return [];
    current = (current as Record<string, unknown>)[part];
  }
  return Array.isArray(current) ? (current as string[]) : [];
}
