import axios from 'axios';
import { getToken } from '@/utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
if (!import.meta.env.VITE_API_BASE_URL) {
  console.error('Missing VITE_API_BASE_URL. Falling back to http://localhost:5000');
}

const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default api;
