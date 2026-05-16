import { getAccessToken, logout as authLogout } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token might be expired
    authLogout();
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = data?.detail || data?.message || "An error occurred";
    throw new Error(error);
  }

  return data;
}

export const api = {
  get: (path: string) => fetchWithAuth(path, { method: "GET" }),
  post: (path: string, body: unknown) => fetchWithAuth(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => fetchWithAuth(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path: string, body: unknown) => fetchWithAuth(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => fetchWithAuth(path, { method: "DELETE" }),
};

// --- Brand Templating API ---
export const getBrandTemplates = () => api.get("/api/base/brand-templates/");
export const getBrandKit = () => api.get("/api/base/brand-kit/");
export const selectTemplate = (templateId: string) => api.post("/api/base/brand-kit/select/", { template_id: templateId });
export const saveBrandKit = (data: { header_html?: string; footer_html?: string; template_css?: string }) => 
  api.patch("/api/base/brand-kit/save/", data);
