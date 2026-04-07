import type { AuthResponse, User } from "@/types/auth";

const ACCESS_TOKEN_KEY = "keru_access_token";
const REFRESH_TOKEN_KEY = "keru_refresh_token";
const USER_KEY = "keru_user";

// --- Access token (in-memory for security, falls back to sessionStorage) ---

let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  if (_accessToken) return _accessToken;
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

export function setAccessToken(token: string): void {
  _accessToken = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

// --- Refresh token (localStorage for persistence across tabs) ---

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

// --- User ---

export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function setStoredUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

// --- Store full auth response ---

export function storeAuthResponse(auth: AuthResponse): void {
  setAccessToken(auth.access_token);
  setRefreshToken(auth.refresh_token);
  setStoredUser(auth.user);
}

// --- Clear all tokens ---

export function clearTokens(): void {
  _accessToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// --- Check if authenticated (has refresh token as source of truth) ---

export function isAuthenticated(): boolean {
  return !!getRefreshToken();
}
