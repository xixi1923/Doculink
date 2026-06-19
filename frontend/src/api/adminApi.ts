import api from './authApi'

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard')
  return response.data
}

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}

export const deleteAdminUser = async (id: number) => {
  const response = await api.delete(`/admin/users/${id}`)
  return response.data
}

export const toggleAdminUserStatus = async (id: number) => {
  const response = await api.post(`/admin/users/${id}/toggle-status`)
  return response.data
}

export const getAdminDocuments = async () => {
  const response = await api.get('/admin/documents')
  return response.data
}

export const approveAdminDocument = async (id: number) => {
  const response = await api.post(`/admin/documents/${id}/approve`)
  return response.data
}

export const rejectAdminDocument = async (id: number) => {
  const response = await api.post(`/admin/documents/${id}/reject`)
  return response.data
}

export const deleteAdminDocument = async (id: number) => {
  const response = await api.delete(`/admin/documents/${id}`)
  return response.data
}
