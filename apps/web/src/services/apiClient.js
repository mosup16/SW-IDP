const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = new Error(body?.message ?? res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const apiClient = {
  get:    (p)    => request(p),
  post:   (p, b) => request(p, { method: 'POST',   body: JSON.stringify(b) }),
  put:    (p, b) => request(p, { method: 'PUT',    body: JSON.stringify(b) }),
  patch:  (p, b) => request(p, { method: 'PATCH',  body: JSON.stringify(b) }),
  delete: (p)    => request(p, { method: 'DELETE' }),
};