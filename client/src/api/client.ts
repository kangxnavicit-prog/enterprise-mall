// Enterprise Mall - Axios Client Configuration
// Creates axios instance with baseURL, timeout, and response interceptor
// Handles 40100 errors: clear token + redirect to login

import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, ERROR_CODES } from '../utils/constants';

/** Axios instance with default configuration */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Request interceptor: attach JWT token from localStorage */
apiClient.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Response interceptor: handle error codes uniformly */
apiClient.interceptors.response.use(
  (response) => {
    // Successful response - return the data directly
    const responseData = response.data;

    // Check business-level error codes
    if (responseData.code !== ERROR_CODES.SUCCESS) {
      // Business error
      if (responseData.code === ERROR_CODES.UNAUTHORIZED) {
        // 40100 → clear token + redirect to login
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(new Error(responseData.message || 'Authentication required'));
      }

      return Promise.reject(new Error(responseData.message || 'Request failed'));
    }

    return responseData;
  },
  (error) => {
    // Network or HTTP-level errors
    if (error.response) {
      const status: number = error.response.status;

      if (status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
