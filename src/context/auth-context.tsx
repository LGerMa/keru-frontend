"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  storeAuthResponse,
  clearTokens,
  getStoredUser,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from storage on mount
    if (checkIsAuthenticated()) {
      setUser(getStoredUser());
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const data = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    } satisfies LoginRequest);
    storeAuthResponse(data);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const data = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    } satisfies RegisterRequest);
    storeAuthResponse(data);
    setUser(data.user);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
