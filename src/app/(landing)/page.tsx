import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Gallery } from "@/components/landing/gallery";
import { PricingSection } from "@/components/landing/pricing-section";
import { Faq } from "@/components/landing/faq";
import { ClosingCta } from "@/components/landing/closing-cta";

const TITLE_ES = "Keru — Deja de adivinar en qué gastas";
const TITLE_EN = "Keru — Stop guessing where it went";
const DESCRIPTION_ES =
  "Keru te muestra a dónde fue cada dólar de tu mes: desglose por categoría, presupuestos por etiqueta y gastos recurrentes. Sin conexión bancaria.";
const DESCRIPTION_EN =
  "Keru shows you where every dollar of your month went: category breakdown, budgets per tag, recurring expenses. No bank connection.";
const OG_DESCRIPTION_ES = "A dónde fue cada dólar de tu mes, por categoría y por hábito.";

export const metadata: Metadata = {
  title: TITLE_ES,
  description: DESCRIPTION_ES,
  openGraph: {
    title: TITLE_ES,
    description: OG_DESCRIPTION_ES,
    locale: "es_ES",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_ES,
    description: OG_DESCRIPTION_ES,
  },
  alternates: {
    languages: {
      es: "/?lang=es",
      en: "/?lang=en",
      "x-default": "/?lang=es",
    },
  },
};

// Kept for reference by future implementers wiring per-request metadata:
// English metadata (TITLE_EN, DESCRIPTION_EN) is served only when a
// visitor's browser requests the ?lang=en variant — Next.js metadata is
// server-rendered before the client-side locale (localStorage/query
// param) is known, so the default here is Spanish per LANDING_DESING.md.
void TITLE_EN;
void DESCRIPTION_EN;

export default function LandingHomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Gallery />
      <PricingSection />
      <Faq />
      <ClosingCta />
    </>
  );
}
