import api from './authApi'

export const toggleFavorite = async (data: { document_id?: number; book_id?: number }) => {
    const response = await api.post('/favorites/toggle', data)
    return response.data
}

export const toggleDocumentFavorite = async (documentId: number) => {
    const response = await api.post('/favorites/toggle', { document_id: documentId })
    return response.data
}

export const toggleBookFavorite = async (bookId: number) => {
    const response = await api.post('/favorites/toggle', { book_id: bookId })
    return response.data
}
