import { api } from "@/lib/api";

// ── Admin endpoints ───────────────────────────────────────────────────────────

export const adminGetTemplates = (params?: Record<string, string>) => {
  const qs = new URLSearchParams({ ...(params || {}) }).toString();
  return api.get(`/api/templates/?${qs}`);
};

export const adminGetTemplate = (id: string) => api.get(`/api/templates/${id}/`);

export const adminCreateTemplate = (data: unknown) => api.post("/api/templates/", data);

export const adminUpdateTemplate = (id: string, data: unknown) =>
  api.put(`/api/templates/${id}/`, data);

export const adminDeleteTemplate = (id: string) => api.delete(`/api/templates/${id}/`);

export const adminGetElements = (templateId: string) =>
  api.get(`/api/template-elements/?template_id=${templateId}`);

export const adminAddElement = (data: unknown) => api.post("/api/template-elements/", data);

export const adminUpdateElement = (id: string, data: unknown) =>
  api.put(`/api/template-elements/${id}/`, data);

export const adminBulkUpdateElements = (data: unknown) =>
  api.put("/api/template-elements/bulk-update/", data);

export const adminDeleteElement = (id: string) => api.delete(`/api/template-elements/${id}/`);

export const adminUploadAsset = (data: unknown) => api.post("/api/template-assets/", data);

// ── User endpoints ────────────────────────────────────────────────────────────

export const getPublishedTemplates = (params?: Record<string, string>) => {
  const qs = new URLSearchParams({ ...(params || {}) }).toString();
  return api.get(`/api/templates/?${qs}`);
};

export const getTemplateDetail = (id: string) => api.get(`/api/templates/${id}/`);

export const getUserDesigns = () => api.get("/api/designs/");

export const getUserDesign = (id: string) => api.get(`/api/designs/${id}/`);

export const saveUserDesign = (data: unknown) => api.post("/api/designs/", data);

export const updateUserDesign = (id: string, data: unknown) =>
  api.put(`/api/designs/${id}/`, data);

export const deleteUserDesign = (id: string) => api.delete(`/api/designs/${id}/`);
