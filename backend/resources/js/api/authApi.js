import api from '@/api';

export const getProfile = async () => {
    const response = await api.get('/profile');
    return response.data.user;
};

export const updateProfile = async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
};

export const updateAvatar = async (formData) => {
    const response = await api.post('/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const changePasswordApi = async (data) => {
    const response = await api.post('/profile/change-password', data);
    return response.data;
};

export default api;
