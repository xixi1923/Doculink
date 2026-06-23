import api from './authApi'

export const getDocuments = async (filters: any) => {
  const response = await api.get('/documents', { params: filters })
  return response.data
}

export const getTrendingDocuments = async () => {
  const response = await api.get('/documents/trending')
  return response.data
}

export const getDocumentById = async (id: string) => {
  const response = await api.get(`/documents/${id}`)
  return response.data
}

export const uploadDocument = async (formData: FormData) => {
  const response = await api.post('/documents', formData)
  return response.data
}

export const addDocumentComment = async (id: string, content: string, parentId?: number) => {
  const response = await api.post(`/documents/${id}/comment`, { content, parent_id: parentId })
  return response.data
}

export const downloadDocument = async (id: string) => {
  const response = await api.get(`/documents/${id}/download`)
  return response.data
}

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`)
  return response.data
}
