import { API_URL } from "@/lib/constants";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from "@/lib/auth";
import type { ApiError } from "@/types/api";
import type { AuthResponse } from "@/types/auth";

class ApiClientError extends Error {
  statusCode: number;
  error?: string;

  constructor({ message, statusCode, error }: ApiError) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Refresh failed");
  }

  const data: AuthResponse = await res.json();
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  return data.access_token;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);

  let res = await fetch(url.toString(), init);

  // 401 → attempt token refresh once
  if (res.status === 401 && getRefreshToken()) {
    let newToken: string;

    if (isRefreshing) {
      newToken = await new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      });
    } else {
      isRefreshing = true;
      try {
        newToken = await refreshAccessToken();
        refreshQueue.forEach((cb) => cb(newToken));
      } finally {
        isRefreshing = false;
        refreshQueue = [];
      }
    }

    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(url.toString(), { method, headers, body: init.body });
  }

  if (!res.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = { message: res.statusText, statusCode: res.status };
    }
    throw new ApiClientError(errorBody);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return request<T>("GET", path, undefined, params);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },
  patch<T>(path: string, body: unknown): Promise<T> {
    return request<T>("PATCH", path, body);
  },
  delete(path: string): Promise<void> {
    return request<void>("DELETE", path);
  },
};

export { ApiClientError };
