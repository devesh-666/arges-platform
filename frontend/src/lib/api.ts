/**
 * API Client — fetch wrapper that calls the Express backend.
 * Automatically adds JWT auth token and handles errors.
 */

const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('arges_token') || '';
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path),
  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = unknown>(path: string) => request<T>(path, { method: 'DELETE' }),

  // Auth
  auth: {
    signup: (data: unknown) => api.post<{ success: boolean; data: { token: string; user: unknown } }>('/auth/signup', data),
    login: (email: string) => api.post<{ success: boolean; data: { token: string; user: unknown } }>('/auth/login', { email }),
    me: () => api.get<{ success: boolean; data: unknown }>('/auth/me'),
  },

  // Users
  users: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/users'),
    get: (id: string) => api.get<{ success: boolean; data: unknown }>(`/users/${id}`),
    update: (id: string, data: unknown) => api.patch<{ success: boolean; data: unknown }>(`/users/${id}`, data),
  },

  // Devices
  devices: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/devices'),
    get: (id: string) => api.get<{ success: boolean; data: unknown }>(`/devices/${id}`),
    update: (id: string, data: unknown) => api.patch<{ success: boolean; data: unknown }>(`/devices/${id}`, data),
  },

  // Families
  families: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/families'),
    addMember: (familyId: string, data: unknown) =>
      api.post<{ success: boolean; data: unknown }>(`/families/${familyId}/members`, data),
  },

  // Consent Requests
  requests: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/requests'),
    create: (data: unknown) => api.post<{ success: boolean; data: unknown; voicePrompt?: string }>('/requests', data),
    respond: (id: string, accepted: boolean) =>
      api.post<{ success: boolean; data: unknown }>(`/requests/${id}/respond`, { accepted }),
  },

  // Alerts
  alerts: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/alerts'),
    create: (data: unknown) => api.post<{ success: boolean; data: unknown }>('/alerts', data),
    resolve: (id: string) => api.patch<{ success: boolean; data: unknown }>(`/alerts/${id}/resolve`),
  },

  // Helpers
  helpers: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/helpers'),
  },

  // Audit Logs
  audit: {
    list: () => api.get<{ success: boolean; data: unknown[] }>('/audit'),
  },

  // Stats
  stats: {
    get: () => api.get<{ success: boolean; data: Record<string, number> }>('/stats'),
  },
};
