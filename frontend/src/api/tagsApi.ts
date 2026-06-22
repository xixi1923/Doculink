import api from './authApi'

export const getTags = async (page?: number) => {
    const response = await api.get('/tags', { params: { page } })
    return response.data
}

export const getTagById = async (id: string) => {
    const response = await api.get(`/tags/${id}`)
    return response.data
}

export const createTag = async (data: { name: string }) => {
    const response = await api.post('/tags', data)
    return response.data
}

export const updateTag = async (id: string, data: { name: string }) => {
    const response = await api.put(`/tags/${id}`, data)
    return response.data
}

export const deleteTag = async (id: string) => {
    const response = await api.delete(`/tags/${id}`)
    return response.data
}
