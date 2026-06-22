import api from './authApi'

export const reportDocument = async (data: { document_id: number; reason: string; description?: string }) => {
    const response = await api.post('/reports', data)
    return response.data
}

export const getAdminReports = async () => {
    const response = await api.get('/admin/reports')
    return response.data
}

export const resolveAdminReport = async (id: number, data: { status: 'pending' | 'resolved' | 'rejected'; notes?: string }) => {
    const response = await api.post(`/admin/reports/${id}/resolve`, data)
    return response.data
}
