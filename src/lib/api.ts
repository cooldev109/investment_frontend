import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token to headers here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';

      // Handle unauthorized
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      return Promise.reject({
        message,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

export default api;
