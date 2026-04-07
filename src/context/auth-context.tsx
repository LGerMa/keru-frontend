"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  storeAuthResponse,
  clearTokens,
  getStoredUser,
  setStoredUser,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth";
import type { User, AuthResponse } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (checkIsAuthenticated()) {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setIsLoading(false);
      } else {
        // Tokens exist but no cached user — fetch from API
        api.get<User>("/v1/users/me")
          .then((u) => { setStoredUser(u); setUser(u); })
          .catch(() => clearTokens())
          .finally(() => setIsLoading(false));
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchAndStoreUser(): Promise<User> {
    const u = await api.get<User>("/v1/users/me");
    setStoredUser(u);
    setUser(u);
    return u;
  }

  async function login(email: string, password: string): Promise<void> {
    const data = await api.post<AuthResponse>("/auth/login", { email, password });
    storeAuthResponse(data);
    await fetchAndStoreUser();
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const data = await api.post<AuthResponse>("/auth/register", { email, password });
    storeAuthResponse(data);
    // Set name after registration (API register only accepts email + password)
    if (name.trim()) {
      await api.patch("/v1/users/me", { name: name.trim() });
    }
    await fetchAndStoreUser();
  }

  async function logout(): Promise<void> {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // best-effort
    } finally {
      clearTokens();
      setUser(null);
    }
  }

  async function refreshUser(): Promise<void> {
    await fetchAndStoreUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
