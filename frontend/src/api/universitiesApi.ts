import api from './authApi'

export const getUniversitiesList = async (filters?: any) => {
    const response = await api.get('/universities', { params: filters })
    return response.data
}

export const getUniversityById = async (id: string) => {
    const response = await api.get(`/universities/${id}`)
    return response.data
}

export const createUniversity = async (data: any) => {
    const response = await api.post('/universities', data)
    return response.data
}

export const updateUniversity = async (id: string, data: any) => {
    const response = await api.put(`/universities/${id}`, data)
    return response.data
}

export const deleteUniversity = async (id: string) => {
    const response = await api.delete(`/universities/${id}`)
    return response.data
}
