// src/lib/api.js
// Centralized API client — semua request ke backend lewat sini

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── Helper fetch wrapper ─────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  // Token expired → paksa logout
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error(data.message || 'Sesi berakhir')
  }

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan')
  }

  return data
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request('/auth/me'),
}

// ─── Transaksi endpoints (siap dipakai nanti) ─────────────────────────────────
export const transaksiApi = {
  getAll:  (params = '') => request(`/transactions${params}`),
  getById: (id)          => request(`/transactions/${id}`),
  create:  (data)        => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data)    => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:  (id)          => request(`/transactions/${id}`, { method: 'DELETE' }),
}

// ─── Kategori endpoints (siap dipakai nanti) ──────────────────────────────────
export const kategoriApi = {
  getAll: ()       => request('/categories'),
  create: (data)   => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, d)  => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete: (id)     => request(`/categories/${id}`, { method: 'DELETE' }),
}

// ─── Dashboard endpoints ──────────────────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => request('/dashboard/summary'),
}

// ─── User endpoints (Profile & Settings) ─────────────────────────────────────
export const userApi = {
  getProfile:     ()       => request('/users/profile'),
  updateProfile:  (data)   => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings:    ()       => request('/users/settings'),
  updateSettings: (data)   => request('/users/settings', { method: 'PUT', body: JSON.stringify(data) }),
}