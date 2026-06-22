import api from './authApi'

export const getQuestions = async (filters?: any) => {
    const response = await api.get('/community/questions', { params: filters })
    return response.data
}

export const getQuestionBySlug = async (slug: string) => {
    const response = await api.get(`/community/questions/${slug}`)
    return response.data
}

export const createQuestion = async (data: { title: string; content: string; category_id?: number }) => {
    const response = await api.post('/community/questions', data)
    return response.data
}

export const createAnswer = async (questionId: number, data: { content: string }) => {
    const response = await api.post(`/community/questions/${questionId}/answers`, data)
    return response.data
}
