import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
