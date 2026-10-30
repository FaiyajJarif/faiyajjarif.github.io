// Tiny client for the Spring Boot API. Base URL comes from VITE_API_URL at build time.
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const hasApi = API_URL.length > 0;

async function request(path, { method = 'GET', body, auth, timeout = 60000 } = {}) {
  if (!hasApi) throw new Error('No API configured');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(API_URL + path, {
      method,
      signal: ctrl.signal,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(auth ? { Authorization: 'Basic ' + btoa(`${auth.username}:${auth.password}`) } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error((data && data.error) || `Request failed (${res.status})`);
      err.status = res.status;
      err.fields = data && data.fields;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  projects: () => request('/api/projects'),
  skills: () => request('/api/skills'),
  stats: () => request('/api/stats'),
  recordVisit: () => request('/api/visits', { method: 'POST' }),
  contact: (body) => request('/api/contact', { method: 'POST', body, timeout: 70000 }),

  admin: {
    me: (auth) => request('/api/admin/me', { auth, timeout: 70000 }),
    messages: (auth) => request('/api/admin/messages', { auth }),
    markRead: (auth, id) => request(`/api/admin/messages/${id}/read`, { method: 'PATCH', auth }),
    deleteMessage: (auth, id) => request(`/api/admin/messages/${id}`, { method: 'DELETE', auth }),
    saveProject: (auth, p) =>
      p.id
        ? request(`/api/admin/projects/${p.id}`, { method: 'PUT', auth, body: p })
        : request('/api/admin/projects', { method: 'POST', auth, body: p }),
    deleteProject: (auth, id) => request(`/api/admin/projects/${id}`, { method: 'DELETE', auth }),
    saveSkill: (auth, s) =>
      s.id
        ? request(`/api/admin/skills/${s.id}`, { method: 'PUT', auth, body: s })
        : request('/api/admin/skills', { method: 'POST', auth, body: s }),
    deleteSkill: (auth, id) => request(`/api/admin/skills/${id}`, { method: 'DELETE', auth }),
  },
};
