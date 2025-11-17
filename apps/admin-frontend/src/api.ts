import axios from 'axios';

const api = axios.create({
  baseURL: process.env.RAILWAY_ENVIRONMENT_NAME === 'production' 
    ? process.env.REACT_APP_BACKEND_URL || '/api'
    : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
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

export { api };
