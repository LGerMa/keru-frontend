"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { api } from "@/lib/api";
import { LogOut, Pencil, X, Check } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Profile</h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm text-primary font-medium"
          >
            <Pencil size={15} />
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
              className="flex items-center gap-1 text-sm text-primary font-medium disabled:opacity-50"
            >
              <Check size={16} />
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold mb-3">
          {initials}
        </div>
        {!editing && (
          <>
            <p className="text-lg font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </>
        )}
      </div>

      {/* Fields */}
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">First name</label>
            <input
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Last name</label>
            <input
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
            <textarea
              className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio…"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="First name" value={user.profile.name ?? "—"} />
          <InfoRow label="Last name" value={user.profile.lastname ?? "—"} />
          {user.profile.bio && (
            <InfoRow label="Bio" value={user.profile.bio} />
          )}
          <InfoRow
            label="Member since"
            value={new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          />
        </div>
      )}

      {/* Logout */}
      {!editing && (
        <div className="mt-10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/40 text-destructive text-sm font-medium disabled:opacity-50"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b last:border-0">
      <span className="text-xs text-muted-foreground w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-right flex-1">{value}</span>
    </div>
  );
}
