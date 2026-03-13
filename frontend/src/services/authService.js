// Authentication service
import apiClient from './api';
import { storeAuthData, clearAuthData, getUserData, isAuthenticated } from '../utils/secureStorage';

export const authService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        await storeAuthData(tokens, user);
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        await storeAuthData(tokens, user);
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      await clearAuthData();
      return { success: true };
    } catch (error) {
      // Clear local data even if server request fails
      await clearAuthData();
      return { success: true };
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    return await isAuthenticated();
  },

  /**
   * Get cached user data
   */
  getCachedUser: async () => {
    return await getUserData();
  },
};

export default authService;

