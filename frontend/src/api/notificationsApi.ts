import api from './authApi'

export const getNotifications = async () => {
    const response = await api.get('/notifications')
    return response.data
}

export const getUnreadNotificationsCount = async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
}

export const markNotificationAsRead = async (id: number) => {
    const response = await api.post(`/notifications/${id}/read`)
    return response.data
}

export const markAllNotificationsAsRead = async () => {
    const response = await api.post('/notifications/read-all')
    return response.data
}

export const deleteNotification = async (id: number) => {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
}
