import { getAccessToken, logout as authLogout, refreshAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

let refreshPromise: Promise<string> | null = null;

async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<any> {
  const token = getAccessToken();
  
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token might be expired
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
    
    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }
        
        const newAccessToken = await refreshPromise;
        refreshPromise = null;
        
        // Retry the request with new token
        return fetchWithAuth(path, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          }
        });
      } catch (error) {
        refreshPromise = null;
        authLogout();
        throw new Error("Session expired. Please login again.");
      }
    } else {
      authLogout();
      throw new Error("Session expired. Please login again.");
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.detail || data?.message || "An error occurred";
    const error: any = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path: string) => fetchWithAuth(path, { method: "GET" }),
  post: (path: string, body: unknown) => 
    fetchWithAuth(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (path: string, body: unknown) => 
    fetchWithAuth(path, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (path: string, body: unknown) => 
    fetchWithAuth(path, { method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (path: string) => fetchWithAuth(path, { method: "DELETE" }),
};

// --- Brand Templating API ---
export const getBrandProfiles = () => api.get("/api/base/brand-profiles/");
export const getBrandTemplates = () => api.get("/api/base/brand-templates/");
export const getBrandKit = () => api.get("/api/base/brand-kit/");
export const selectTemplate = (templateId: string) => api.post("/api/base/brand-kit/select/", { template_id: templateId });
export const saveBrandKit = (data: {
  header_html?: string
  footer_html?: string
  template_css?: string
  elements?: string       // JSON-serialised CE[]
  brand_colors?: string   // JSON-serialised { primary, secondary }
}) => api.patch("/api/base/brand-kit/save/", data);
