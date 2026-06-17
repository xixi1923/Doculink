import api from './authApi'

export const getHomeStats = async () => {
  const response = await api.get('/stats/home')
  return response.data
}
