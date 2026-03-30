import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import apiClient from './api';
import { isAuthenticated } from '../utils/secureStorage';

const TOKEN_STORAGE_KEY = 'vigilux_fcm_token';

let Notifications = null;

try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.warn('[Notifications] expo-notifications is not installed. Notifications are disabled.');
}

export function getNotificationsModule() {
  return Notifications;
}

export async function configureNotifications() {
  if (!Notifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'VIGILUX Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#007AFF',
    });
  }
}

export async function requestNotificationPermission() {
  if (!Notifications) {
    return { enabled: false, status: 'unavailable' };
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    let finalStatus = current.status;

    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
    }

    return {
      enabled: finalStatus === 'granted',
      status: finalStatus,
    };
  } catch (error) {
    console.error('[Notifications] Permission request failed:', error);
    return { enabled: false, status: 'error' };
  }
}

export async function getStoredFcmToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('[FCM] Failed to read cached token:', error);
    return null;
  }
}

export async function storeFcmToken(token) {
  try {
    if (!token) return;
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('[FCM] Failed to cache token:', error);
  }
}

export async function clearStoredFcmToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('[FCM] Failed to clear cached token:', error);
  }
}

export async function getFcmToken() {
  if (!Notifications) {
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId ||
      Constants.manifest2?.extra?.eas?.projectId;

    if (!projectId) {
      console.warn('[Push] Missing Expo projectId; Expo push token unavailable');
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenResponse?.data || null;

    if (token) {
      await storeFcmToken(token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('[FCM] Failed to get device token:', error);
    return null;
  }
}

export async function syncFcmTokenToBackend(tokenOverride = null) {
  if (!Notifications) {
    return { success: false, reason: 'unavailable' };
  }

  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return { success: false, reason: 'unauthenticated' };
    }

    const token = tokenOverride || (await getFcmToken()) || (await getStoredFcmToken());
    if (!token) {
      return { success: false, reason: 'missing-token' };
    }

    await apiClient.post('/users/fcm-token', {
      token,
      platform: Platform.OS,
      provider: 'expo',
    });

    await storeFcmToken(token);

    return { success: true, token };
  } catch (error) {
    console.error('[FCM] Failed to sync token to backend:', error);
    return { success: false, reason: 'request-failed' };
  }
}

export async function deleteFcmTokenFromBackend() {
  try {
    const token = await getStoredFcmToken();
    if (!token) {
      return { success: true, skipped: true };
    }

    await apiClient.delete('/users/fcm-token', {
      data: { token },
    });
    await clearStoredFcmToken();

    return { success: true };
  } catch (error) {
    console.error('[FCM] Failed to delete token from backend:', error);
    return { success: false };
  }
}

export function subscribeToTokenRefresh(callback) {
  return () => {};
}

export function addNotificationReceivedListener(callback) {
  if (!Notifications) {
    return { remove: () => {} };
  }

  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseListener(callback) {
  if (!Notifications) {
    return { remove: () => {} };
  }

  return Notifications.addNotificationResponseReceivedListener(callback);
}

export async function getLastNotificationResponse() {
  if (!Notifications) {
    return null;
  }

  return Notifications.getLastNotificationResponseAsync();
}

export async function clearSystemBadgeCount() {
  if (!Notifications) {
    return;
  }

  await Notifications.setBadgeCountAsync(0);
}

export function normalizeRemoteMessage(notification) {
  if (!notification) {
    return null;
  }

  const content = notification.request?.content || {};

  return {
    id: notification.request?.identifier || String(Date.now()),
    title: content.title || content.data?.title || 'Notification',
    body: content.body || content.data?.body || '',
    data: content.data || {},
    sentTime: notification.date ? new Date(notification.date).getTime() : Date.now(),
  };
}

export function getNotificationTarget(data = {}) {
  const reportId = data.reportId || data.related_report_id || data.report_id;

  if (reportId) {
    return {
      routeName: 'ReportDetail',
      params: { id: reportId },
    };
  }

  if (data.type === 'nearby_incident') {
    return {
      routeName: 'Map',
      params: undefined,
    };
  }

  return {
    routeName: 'AlertsTab',
    params: undefined,
  };
}