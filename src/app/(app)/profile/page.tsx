"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { api } from "@/lib/api";
import { LogOut, Pencil, X, Check, CreditCard, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuthContext();
  const router = useRouter();

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
    .join(" ") || "No name set";

  const initials = [user.profile.name, user.profile.lastname]
    .filter(Boolean)
    .map((s) => s![0].toUpperCase())
    .join("") || user.email[0].toUpperCase();

  return (
    <div className="pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-tight">Profile</h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm text-primary font-semibold"
          >
            <Pencil size={14} />
            Edit
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
              {isSaving ? "Saving…" : "Save"}
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
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Fields */}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">First name</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Last name</label>
            <input
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Bio</label>
            <textarea
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio…"
            />
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
          <InfoRow label="First name" value={user.profile.name ?? "—"} />
          <InfoRow label="Last name" value={user.profile.lastname ?? "—"} />
          {user.profile.bio && <InfoRow label="Bio" value={user.profile.bio} />}
        </div>
      )}

      {/* Settings */}
      {!editing && (
        <div className="mt-5 bg-card rounded-2xl shadow-card-md border border-border overflow-hidden">
          <Link
            href="/payment-sources"
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
          >
            <CreditCard size={16} className="text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium">Payment sources</span>
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
            {isLoggingOut ? "Signing out…" : "Sign out"}
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
