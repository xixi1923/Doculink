import api from './authApi'

export const getBooks = async (filters?: any) => {
    const response = await api.get('/books', { params: filters })
    return response.data
}

export const getBookById = async (id: string) => {
    const response = await api.get(`/books/${id}`)
    return response.data
}

export const getBookCategories = async () => {
    const response = await api.get('/books/categories')
    return response.data
}

export const uploadBook = async (formData: FormData) => {
    const response = await api.post('/books', formData)
    return response.data
}

export const updateBook = async (id: string, formData: FormData) => {
    const response = await api.put(`/books/${id}`, formData)
    return response.data
}

export const deleteBook = async (id: string) => {
    const response = await api.delete(`/books/${id}`)
    return response.data
}

export const downloadBook = async (id: string) => {
    const response = await api.get(`/books/${id}/download`)
    return response.data
}
