import api from '../lib/api';

/**
 * Server Authoritative Departments Service
 */

// --- Public Endpoints ---
export async function getDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/departments?${query}` : '/departments';
  const response = await api.get(endpoint);
  return Array.isArray(response) ? response : (response?.data || []);
}

export async function getDepartmentBySlugOrId(slugOrId, isPreview = false) {
  const endpoint = isPreview 
    ? `/departments/${slugOrId}?preview=1` 
    : `/departments/${slugOrId}`;
  return await api.get(endpoint);
}

// --- Admin CMS Endpoints (Sanctum Protected) ---
export async function getAdminDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/admin/departments?${query}` : '/admin/departments';
  const response = await api.get(endpoint);
  return Array.isArray(response) ? response : (response?.data || []);
}

export async function getAdminDepartment(id) {
  return await api.get(`/admin/departments/${id}`);
}

export async function createDepartment(data) {
  return await api.post('/admin/departments', data);
}

export async function updateDepartment(id, data) {
  return await api.put(`/admin/departments/${id}`, data);
}

export async function deleteDepartment(id) {
  return await api.delete(`/admin/departments/${id}`);
}

export async function saveDepartmentDraft(id, payload) {
  return await api.post(`/admin/departments/${id}/draft`, payload);
}

export async function publishDepartment(id) {
  return await api.post(`/admin/departments/${id}/publish`, {});
}

export async function unpublishDepartment(id) {
  return await api.post(`/admin/departments/${id}/unpublish`, {});
}
