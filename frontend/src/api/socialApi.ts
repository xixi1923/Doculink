import api from './authApi'

export const toggleFollow = async (userId: number) => {
    const response = await api.post('/follow/toggle', { user_id: userId })
    return response.data
}

export const followUser = async (userId: string | number) => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
}

export const unfollowUser = async (userId: string | number) => {
    const response = await api.delete(`/users/${userId}/follow`)
    return response.data
}

export const getRelationshipStatus = async (userId: string | number) => {
    const response = await api.get(`/users/${userId}/relationship-status`)
    return response.data
}

