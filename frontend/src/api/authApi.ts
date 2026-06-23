import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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

export const getUserProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const getPublicProfileApi = async (username: string) => {
  const response = await api.get(`/profiles/${username}`)
  return response.data
}

export const getUserDocumentsApi = async (id: string) => {
  const response = await api.get(`/users/${id}/documents`)
  return response.data
}

export const followUserApi = async (id: string) => {
  const response = await api.post(`/users/${id}/follow`)
  return response.data
}

export const unfollowUserApi = async (id: string) => {
  const response = await api.delete(`/users/${id}/follow`)
  return response.data
}

export const deleteDocumentApi = async (id: string) => {
  const response = await api.delete(`/documents/${id}`)
  return response.data
}

// Comments API
export const updateCommentApi = async (id: number, content: string) => {
    const response = await api.put(`/comments/${id}`, { content })
    return response.data
}

export const deleteCommentApi = async (id: number) => {
    const response = await api.delete(`/comments/${id}`)
    return response.data
}

export const replyCommentApi = async (id: number, content: string) => {
    const response = await api.post(`/comments/${id}/reply`, { content })
    return response.data
}

export const toggleCommentLikeApi = async (id: number) => {
    const response = await api.post(`/comments/${id}/like`)
    return response.data
}

export const toggleDocumentLikeApi = async (id: number) => {
    const response = await api.post(`/documents/${id}/like`)
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

// Messages API
export const getConversations = async () => {
  const response = await api.get('/messages/conversations')
  return response.data
}

export const searchUsersApi = async (query: string) => {
  const response = await api.get(`/messages/users/search?q=${query}`)
  return response.data
}

export const startConversationApi = async (userId: string | number) => {
  const response = await api.post('/messages/start', { user_id: userId })
  return response.data
}

export const getUnreadMessagesCount = async () => {
  const response = await api.get('/messages/unread-count')
  return response.data
}

export const getConversationMessages = async (conversationId: number | string) => {
  const response = await api.get(`/messages/${conversationId}`)
  return response.data
}

export const sendChatMessageApi = async (conversationId: number | string, message: string) => {
  const response = await api.post('/messages/send', { conversation_id: conversationId, message })
  return response.data
}

export const markConversationAsRead = async (conversationId: number | string) => {
  const response = await api.put('/messages/read', { conversation_id: conversationId })
  return response.data
}

// Conversation management
export const deleteConversationApi = async (conversationId: number | string) => {
  const response = await api.delete(`/messages/${conversationId}/delete`)
  return response.data
}

export const endConversationApi = async (conversationId: number | string) => {
  const response = await api.post(`/messages/${conversationId}/end`)
  return response.data
}

export const reopenConversationApi = async (conversationId: number | string) => {
  const response = await api.post(`/messages/${conversationId}/reopen`)
  return response.data
}

// User blocking
export const blockUserApi = async (userId: number | string, reason?: string) => {
  const response = await api.post('/users/block', { user_id: userId, reason })
  return response.data
}

export const unblockUserApi = async (userId: number | string) => {
  const response = await api.post(`/users/${userId}/unblock`)
  return response.data
}

export const getBlockedUsersApi = async () => {
  const response = await api.get('/users/blocked')
  return response.data
}

// Typing indicators
export const setTypingIndicatorApi = async (conversationId: number | string, isTyping: boolean) => {
  const response = await api.post(`/messages/${conversationId}/typing`, { is_typing: isTyping })
  return response.data
}

export const getTypingIndicatorsApi = async (conversationId: number | string) => {
  const response = await api.get(`/messages/${conversationId}/typing-users`)
  return response.data
}

export const downloadAttachmentApi = async (attachmentId: number | string, fileName: string) => {
  const response = await api.get(`/messages/attachments/${attachmentId}/download`, {
    responseType: 'blob'
  })

  // Create a blob URL and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  // Clean up
  link.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export default api
