import * as SecureStore from 'expo-secure-store';

/**
 * Secure token storage using Expo SecureStore
 * Data is encrypted and stored in:
 * - iOS: Keychain
 * - Android: EncryptedSharedPreferences
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ispy_access_token',
  REFRESH_TOKEN: 'ispy_refresh_token',
  USER_DATA: 'ispy_user_data',
};

/**
 * Store access token securely
 */
export const storeAccessToken = async (token) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error storing access token:', error);
    return false;
  }
};

/**
 * Store refresh token securely
 */
export const storeRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error storing refresh token:', error);
    return false;
  }
};

/**
 * Store user data securely
 */
export const storeUserData = async (userData) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

/**
 * Get access token
 */
export const getAccessToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Get user data
 */
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Store complete authentication data
 */
export const storeAuthData = async (tokens, user) => {
  try {
    await Promise.all([
      storeAccessToken(tokens.accessToken),
      storeRefreshToken(tokens.refreshToken),
      storeUserData(user),
    ]);
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default {
  storeAccessToken,
  storeRefreshToken,
  storeUserData,
  getAccessToken,
  getRefreshToken,
  getUserData,
  storeAuthData,
  clearAuthData,
  isAuthenticated,
};
