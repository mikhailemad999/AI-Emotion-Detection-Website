import api from './api';

export const emotionService = {
  analyze: async (text) => {
    const response = await api.post('/emotion/analyze/', { text });
    return response.data;
  },
  
  getHistory: async (limit = 20) => {
    const response = await api.get(`/emotion/history/?limit=${limit}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/emotion/stats/');
    return response.data;
  }
};

export default emotionService;
