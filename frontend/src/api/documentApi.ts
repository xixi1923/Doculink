import api from './authApi'

export const getDocuments = async (filters: any) => {
  const response = await api.get('/documents', { params: filters })
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
