"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuthContext } from "@/context/auth-context";
import { api } from "@/lib/api";
import { setLocale } from "@/app/actions/set-locale";
import type { Locale } from "@/i18n/request";
import { LogOut, Pencil, X, Check, CreditCard, ChevronRight } from "lucide-react";

const PROFILE_MONTH_YEAR_FORMAT: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuthContext();
  const router = useRouter();
  const t = useTranslations("Profile");
  const locale = useLocale();

  async function changeLocale(next: Locale) {
    if (next === locale) return;
    await setLocale(next);
    router.refresh();
  }

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [name, setName] = useState(user?.profile.name ?? "");
  const [lastname, setLastname] = useState(user?.profile.lastname ?? "");
  const [bio, setBio] = useState(user?.profile.bio ?? "");

  function startEdit() {
    setName(user?.profile.name ?? "");
    setLastname(user?.profile.lastname ?? "");
    setBio(user?.profile.bio ?? "");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function save() {
    setIsSaving(true);
    try {
      await api.patch("/v1/users/me", {
        name: name.trim() || null,
        lastname: lastname.trim() || null,
        bio: bio.trim() || null,
      });
      await refreshUser();
      setEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  const displayName = [user.profile.name, user.profile.lastname]
    .filter(Boolean)
    .join(" ") || t("noNameSet");

  const initials = [user.profile.name, user.profile.lastname]
    .filter(Boolean)
    .map((s) => s![0].toUpperCase())
    .join("") || user.email[0].toUpperCase();

  return (
    <div className="pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-tight">{t("title")}</h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm text-primary font-semibold"
          >
            <Pencil size={14} />
            {t("edit")}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={cancelEdit} className="text-muted-foreground">
              <X size={20} />
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="flex items-center gap-1 text-sm text-primary font-semibold disabled:opacity-50"
            >
              <Check size={16} />
              {isSaving ? t("saving") : t("save")}
            </button>
          </div>
        )}
      </div>

      {/* Avatar card row — Option B */}
      <div className="bg-card rounded-2xl shadow-card-md border border-border p-4 flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 flex-shrink-0 flex items-center justify-center gradient-hero text-white text-xl font-extrabold shadow-colored"
          style={{ borderRadius: "14px" }}
        >
          {initials}
        </div>
        <div>
          <p className="text-base font-bold text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-xs text-primary font-medium mt-0.5">
            {t("memberSince", {
              date: new Date(user.createdAt).toLocaleDateString(locale, PROFILE_MONTH_YEAR_FORMAT),
            })}
          </p>
        </div>
      </div>

      {/* Fields */}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">{t("firstName")}</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("firstName")}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">{t("lastName")}</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder={t("lastName")}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">{t("bio")}</label>
            <textarea
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
            />
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
          <InfoRow label={t("firstName")} value={user.profile.name ?? "—"} />
          <InfoRow label={t("lastName")} value={user.profile.lastname ?? "—"} />
          {user.profile.bio && <InfoRow label={t("bio")} value={user.profile.bio} />}
        </div>
      )}

      {/* Settings */}
      {!editing && (
        <div className="mt-5 bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <span className="text-sm font-medium">{t("language")}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => changeLocale("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  locale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("languageEnglish")}
              </button>
              <button
                onClick={() => changeLocale("es")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  locale === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("languageSpanish")}
              </button>
            </div>
          </div>
          <Link
            href="/payment-sources"
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
          >
            <CreditCard size={16} className="text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium">{t("paymentSources")}</span>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </Link>
        </div>
      )}

      {/* Sign out */}
      {!editing && (
        <div className="mt-8">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-semibold disabled:opacity-50"
          >
            <LogOut size={15} />
            {isLoggingOut ? t("signingOut") : t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground font-medium w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-right flex-1">{value}</span>
    </div>
  );
}
