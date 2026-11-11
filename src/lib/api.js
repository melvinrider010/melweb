/**
 * Central Secure API Client for St. Philomena's College Laravel Backend
 */

const API_BASE = '/api/v1';

// In-Memory Token Reference with sessionStorage / localStorage fallback
let inMemoryAuthToken = typeof window !== 'undefined' ? (sessionStorage.getItem('stphilos_auth_token') || localStorage.getItem('stphilos_auth_token') || '') : '';

export function getAuthToken() {
  if (!inMemoryAuthToken && typeof window !== 'undefined') {
    inMemoryAuthToken = sessionStorage.getItem('stphilos_auth_token') || localStorage.getItem('stphilos_auth_token') || '';
  }
  return inMemoryAuthToken;
}

export function setAuthToken(token) {
  inMemoryAuthToken = token || '';
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('stphilos_auth_token', token);
      localStorage.setItem('stphilos_auth_token', token);
    } else {
      sessionStorage.removeItem('stphilos_auth_token');
      localStorage.removeItem('stphilos_auth_token');
    }
  }
}

function getXsrfCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function initCsrf() {
  try {
    await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include'
    });
  } catch (e) {
    // Silently continue if backend is starting or offline
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const xsrfToken = getXsrfCookie();

  const headers = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (xsrfToken && options.method && options.method.toUpperCase() !== 'GET') {
    headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  initCsrf,
  get: (endpoint, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return request(url, { method: 'GET' });
  },
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) => request(endpoint, { method: 'POST', body: formData }),
};

export default api;
