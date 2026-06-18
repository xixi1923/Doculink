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

export const login = async (credentials: any) => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const register = async (userData: any) => {
  const response = await api.post('/register', userData)
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

export default api
