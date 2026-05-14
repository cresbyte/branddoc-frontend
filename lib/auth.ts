// lib/auth.ts
// Central module for all auth API calls and JWT token management.
import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Token storage ───────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("access") : null;
}

export function getRefreshToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
}

function saveTokens(access: string, refresh: string) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  Cookies.set("authenticated", "true", { expires: 7 });
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  Cookies.remove("authenticated");
}

export function saveUser(user: AuthUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  profile_picture: string;
  auth_provider: "email" | "google";
  created_at: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

// ── Shared fetch helper ──────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Prefer the most useful error message from the response
    const message =
      data?.detail ??
      Object.values(data as Record<string, string[]>)
        .flat()
        .join(" ") ??
      "Something went wrong";
    throw new Error(message);
  }

  return data as T;
}

// ── Auth API calls ───────────────────────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  name: string,
  password: string
): Promise<AuthUser> {
  const data = await post<TokenResponse>("/api/auth/register/", {
    email,
    name,
    password,
  });
  saveTokens(data.access, data.refresh);
  saveUser(data.user);
  return data.user;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const data = await post<TokenResponse>("/api/auth/login/", {
    email,
    password,
  });
  saveTokens(data.access, data.refresh);
  saveUser(data.user);
  return data.user;
}

export async function loginWithGoogle(idToken: string): Promise<AuthUser> {
  const data = await post<TokenResponse>("/api/auth/google/", {
    id_token: idToken,
  });
  saveTokens(data.access, data.refresh);
  saveUser(data.user);
  return data.user;
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken();
  const access = getAccessToken();
  if (refresh && access) {
    await fetch(`${API_BASE}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ refresh }),
    }).catch(() => {}); // best-effort — clear locally regardless
  }
  clearTokens();
}

export async function sendResetCode(email: string): Promise<void> {
  await post("/api/auth/forgot-password/", { email });
}

export async function verifyResetCode(
  email: string,
  code: string
): Promise<void> {
  await post("/api/auth/verify-reset-code/", { email, code });
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await post("/api/auth/reset-password/", {
    email,
    code,
    new_password: newPassword,
  });
}
