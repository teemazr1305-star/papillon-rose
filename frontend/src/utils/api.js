/**
 * Thin fetch wrapper around the backend API.
 * In dev, Vite proxies /api -> http://localhost:4000 (see vite.config.js),
 * so relative paths work both in dev and once built+served behind the
 * same domain as the API.
 */

const BASE = import.meta.env.VITE_API_URL + '/api';

async function request(path, { method = 'GET', body, token, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some error pages) — leave data null
  }

  if (!res.ok) {
    const message = data?.error || 'حدث خطأ غير متوقع';
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  // ---------- Public: products ----------
  getProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),

  // ---------- Public: categories ----------
  getCategories: () => request('/categories'),

  // ---------- Public: orders ----------
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),

  // ---------- Public: reviews ----------
  getReviews: (limit) => request(`/reviews${limit ? `?limit=${limit}` : ''}`),
  submitReview: (payload) => request('/reviews', { method: 'POST', body: payload }),

  // ---------- Public: newsletter ----------
  subscribeNewsletter: (email) => request('/newsletter', { method: 'POST', body: { email } }),

  // ---------- Auth ----------
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: (token) => request('/auth/me', { token }),
  changePassword: (token, payload) => request('/auth/password', { method: 'PUT', token, body: payload }),

  // ---------- Admin: products ----------
  createProduct: (token, payload) => request('/products', { method: 'POST', token, body: payload }),
  updateProduct: (token, id, payload) => request(`/products/${id}`, { method: 'PUT', token, body: payload }),
  deleteProduct: (token, id, hard = false) =>
    request(`/products/${id}${hard ? '?hard=1' : ''}`, { method: 'DELETE', token }),
  uploadCover: (token, file) => {
    const form = new FormData();
    form.append('cover', file);
    return request('/products/upload-cover', { method: 'POST', token, body: form, isFormData: true });
  },
  uploadProductImages: (token, productId, files) => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    return request(`/products/${productId}/images`, { method: 'POST', token, body: form, isFormData: true });
  },
  deleteProductImage: (token, imageId) => request(`/products/images/${imageId}`, { method: 'DELETE', token }),

  // ---------- Admin: categories ----------
  createCategory: (token, payload) => request('/categories', { method: 'POST', token, body: payload }),
  updateCategory: (token, id, payload) => request(`/categories/${id}`, { method: 'PUT', token, body: payload }),
  deleteCategory: (token, id) => request(`/categories/${id}`, { method: 'DELETE', token }),

  // ---------- Admin: orders ----------
  getOrders: (token, status) => request(`/orders${status ? `?status=${status}` : ''}`, { token }),
  updateOrderStatus: (token, id, status) =>
    request(`/orders/${id}/status`, { method: 'PUT', token, body: { status } }),

  // ---------- Admin: dashboard ----------
  getDashboardStats: (token) => request('/dashboard/stats', { token }),

  // ---------- Admin: reviews ----------
  deleteReview: (token, id) => request(`/reviews/${id}`, { method: 'DELETE', token }),
};

export function productImageUrl(filename) {
  if (!filename) return '/images/placeholder-product.png';
  if (filename.startsWith('http')) return filename;
  return `/uploads/products/${filename}`;
}
