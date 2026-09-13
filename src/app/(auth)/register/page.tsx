"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { ApiClientError } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError(t("signInError"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 gradient-hero text-white text-xl font-extrabold shadow-colored"
          style={{ borderRadius: "14px" }}
        >
          K
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            keru<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("tagline")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-colored transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-1"
        >
          {isLoading ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-primary font-semibold">
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
