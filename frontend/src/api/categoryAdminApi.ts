import api from './authApi'

export const createCategory = async (data: any) => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id: number, data: any) => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}
