import api from '../lib/api';

/**
 * Public Departments Service - Server Authoritative
 */
export async function getDepartments() {
  const response = await api.get('/departments');
  return Array.isArray(response) ? response : (response?.data || []);
}
