import axios from 'axios';

// Base API URL - update for production
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thirike_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===== AUTH =====
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  sendOTP: (data) => api.post('/auth/send-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ===== LOST ITEMS =====
export const lostAPI = {
  // Create a lost item report (multipart/form-data for image)
  create: (formData) =>
    api.post('/lost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get all lost items (with filters)
  getAll: (params) => api.get('/lost', { params }),

  // Get single lost item
  getById: (id) => api.get(`/lost/${id}`),

  // Update lost item
  update: (id, data) => api.put(`/lost/${id}`, data),

  // Delete lost item
  delete: (id) => api.delete(`/lost/${id}`),

  // Get matches for a lost item
  getMatches: (id) => api.get(`/lost/${id}/matches`),
};

// ===== FOUND ITEMS =====
export const foundAPI = {
  // Create a found item report
  create: (formData) =>
    api.post('/found', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get all found items (with filters)
  getAll: (params) => api.get('/found', { params }),

  // Get single found item
  getById: (id) => api.get(`/found/${id}`),

  // Update found item
  update: (id, data) => api.put(`/found/${id}`, data),

  // Delete found item
  delete: (id) => api.delete(`/found/${id}`),
};

// ===== DOCUMENTS (Secure) =====
export const documentAPI = {
  // Verify document ownership via OTP
  verifyOwnership: (itemId, data) => api.post(`/documents/${itemId}/verify`, data),

  // Submit claim for important document
  submitClaim: (itemId, formData) =>
    api.post(`/documents/${itemId}/claim`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ===== MATCHING =====
export const matchAPI = {
  // Find potential matches for a lost item
  findMatches: (lostItemId) => api.get(`/matches/lost/${lostItemId}`),

  // Confirm a match
  confirmMatch: (matchId) => api.post(`/matches/${matchId}/confirm`),
};

export default api;
export const reportLostItem = (formData) => lostAPI.create(formData);

export const reportFoundItem = (formData) => foundAPI.create(formData);

export const getItems = (params) => lostAPI.getAll(params);

export const getItemById = (id) => lostAPI.getById(id);

export const claimItem = (itemId, formData) =>
  documentAPI.submitClaim(itemId, formData);
