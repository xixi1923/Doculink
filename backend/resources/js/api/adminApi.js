import api from '@/api';

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const toggleAdminUserStatus = async (id) => {
  const response = await api.post(`/admin/users/${id}/toggle-status`);
  return response.data;
};

export const getAdminDocuments = async () => {
  const response = await api.get('/admin/documents');
  return response.data;
};

export const approveAdminDocument = async (id) => {
  const response = await api.post(`/admin/documents/${id}/approve`);
  return response.data;
};

export const rejectAdminDocument = async (id) => {
  const response = await api.post(`/admin/documents/${id}/reject`);
  return response.data;
};

export const deleteAdminDocument = async (id) => {
  const response = await api.delete(`/admin/documents/${id}`);
  return response.data;
};

// Categories
export const getAdminCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createAdminCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data;
};

export const updateAdminCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteAdminCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Subscriptions
export const getAdminSubscriptions = async () => {
  const response = await api.get('/admin/subscriptions');
  return response.data;
};

export const verifyAdminSubscription = async (id, data) => {
  const response = await api.post(`/admin/subscriptions/${id}/verify`, data);
  return response.data;
};

// Books
export const getAdminBooks = async () => {
  const response = await api.get('/admin/books');
  return response.data;
};

export const createAdminBook = async (data) => {
  const response = await api.post('/admin/books', data);
  return response.data;
};

export const updateAdminBook = async (id, data) => {
  const response = await api.post(`/admin/books/${id}`, data); // Using POST for multipart/form-data
  return response.data;
};

export const deleteAdminBook = async (id) => {
  const response = await api.delete(`/admin/books/${id}`);
  return response.data;
};
