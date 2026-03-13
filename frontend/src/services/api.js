// API configuration and axios instance
import axios from 'axios';
import { getAccessToken, getRefreshToken, storeAccessToken, storeRefreshToken, clearAuthData } from '../utils/secureStorage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token
          const refreshToken = await getRefreshToken();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

          // Store new tokens
          await storeAccessToken(accessToken);
          await storeRefreshToken(newRefreshToken);

          // Update original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Process queued requests
          processQueue(null, accessToken);

          isRefreshing = false;

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth data and redirect to login
          processQueue(refreshError, null);
          isRefreshing = false;
          
          await clearAuthData();
          // You can emit an event here to trigger navigation to login
          // EventEmitter.emit('LOGOUT');
          
          return Promise.reject(refreshError);
        }
      }
    }

    // Global error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

