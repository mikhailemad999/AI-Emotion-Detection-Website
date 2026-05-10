import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.success && response.data.data.tokens) {
      localStorage.setItem('access_token', response.data.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.data.tokens.refresh);
    }
    return response.data;
  },
  
  register: async (username, email, password, password_confirm) => {
    const response = await api.post('/auth/register/', {
      username,
      email,
      password,
      password_confirm
    });
    if (response.data.success && response.data.data.tokens) {
      localStorage.setItem('access_token', response.data.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.data.tokens.refresh);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile/', data);
    return response.data;
  }
};

export default authService;
