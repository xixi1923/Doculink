import api from './authApi'

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const createCategory = async (data: any) => {
  const response = await api.post('/categories', data)
  return response.data
}
