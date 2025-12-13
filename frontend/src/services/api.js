import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  signup: (userData) => api.post('/auth/register/', userData),
  logout: () => localStorage.clear(),
};

export const tripAPI = {
  getAll: () => api.get('/trips/'),
  getById: (id) => api.get(`/trips/${id}/`),
  create: (data) => api.post('/trips/', data),
  update: (id, data) => api.put(`/trips/${id}/`, data),
  delete: (id) => api.delete(`/trips/${id}/`),
  getActivities: (id) => api.get(`/trips/${id}/activities/`),
  getStatistics: (id) => api.get(`/trips/${id}/statistics/`),
  getDashboard: () => api.get('/trips/dashboard/'),
};

export const activityAPI = {
  getAll: () => api.get('/activities/'),
  create: (data) => api.post('/activities/', data),
  update: (id, data) => api.put(`/activities/${id}/`, data),
  delete: (id) => api.delete(`/activities/${id}/`),
  toggleComplete: (id) => api.post(`/activities/${id}/toggle_complete/`),
};

export const expenseAPI = {
  getAll: (tripId) => api.get('/expenses/', { params: { trip: tripId } }),
  create: (data) => api.post('/expenses/', data),
  delete: (id) => api.delete(`/expenses/${id}/`),
};

export const checklistAPI = {
  getAll: (tripId) => api.get('/checklist/', { params: { trip: tripId } }),
  create: (data) => api.post('/checklist/', data),
  toggle: (id) => api.post(`/checklist/${id}/toggle/`),
  delete: (id) => api.delete(`/checklist/${id}/`),
};

export default api;
