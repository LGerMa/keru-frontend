"use client";

import type { ReactNode } from "react";
import { LandingLocaleProvider } from "@/context/landing-locale-context";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <LandingLocaleProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <LandingNav />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </LandingLocaleProvider>
  );
}
