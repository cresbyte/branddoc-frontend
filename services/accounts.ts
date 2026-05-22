import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture: string;
  is_staff: boolean;
  auth_provider: string;
  created_at: string;
}

export interface BrandProfile {
  id: string;
  user: string;
  name: string;
  tagline: string;
  website: string;
  logo_url: string;
  email: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// ── Admin endpoints ───────────────────────────────────────────────────────────

export const adminGetUsers = () => api.get<User[]>("/api/auth/users/");

// ── Brand Profile endpoints ───────────────────────────────────────────────────

export const getBrandProfiles = () => api.get<BrandProfile[]>("/api/auth/brands/");

export const getBrandProfile = (id: string) => api.get<BrandProfile>(`/api/auth/brands/${id}/`);

export const createBrandProfile = (data: Partial<BrandProfile>) => 
  api.post<BrandProfile>("/api/auth/brands/", data);

export const updateBrandProfile = (id: string, data: Partial<BrandProfile>) => 
  api.put<BrandProfile>(`/api/auth/brands/${id}/`, data);

export const deleteBrandProfile = (id: string) => api.delete(`/api/auth/brands/${id}/`);
