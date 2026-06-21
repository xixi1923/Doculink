import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = async (credentials: any) => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const register = async (userData: any) => {
  const response = await api.post('/register', userData)
  return response.data
}

export const firebaseLogin = async (payload: any) => {
  const response = await api.post('/firebase-login', payload)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/profile')
  return response.data
}

export const updateProfile = async (userData: any) => {
  const response = await api.put('/profile', userData)
  return response.data
}

export const updateAvatar = async (formData: FormData) => {
  const response = await api.post('/profile/avatar', formData)
  return response.data
}

export const changePasswordApi = async (data: any) => {
  const response = await api.post('/profile/change-password', data)
  return response.data
}

export const deleteAccountApi = async () => {
  const response = await api.delete('/profile')
  return response.data
}

export const toggleFavoriteApi = async (data: { document_id?: number, book_id?: number }) => {
  const response = await api.post('/favorites/toggle', data)
  return response.data
}

export const getUniversities = async () => {
  const response = await api.get('/universities')
  return response.data
}

export const getUniversityDetail = async (id: string) => {
  const response = await api.get(`/universities/${id}`)
  return response.data
}

export default api
