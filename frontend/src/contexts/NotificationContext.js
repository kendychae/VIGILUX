/**
 * NotificationContext.js
 * Issue #44 - W5: Configure Push Notification Architecture
 * Issue #54 - W5: Notification Listener & Notification History Screen
 *
 * Wires up Expo notifications to:
 *  - Request permission and register the push token on app start
 *  - POST the token to /api/v1/users/fcm-token
 *  - Display an in-app banner when a notification arrives in the foreground
 *  - Expose a badge count and the latest notification payload to all screens
 *  - Map notification data.type to the appropriate navigation action on tap
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  clearSystemBadgeCount,
  configureNotifications,
  getFcmToken,
  getLastNotificationResponse,
  getNotificationTarget,
  normalizeRemoteMessage,
  requestNotificationPermission,
  subscribeToTokenRefresh,
  syncFcmTokenToBackend,
} from '../services/notificationService';

export const NotificationContext = createContext({
  badgeCount: 0,
  latestNotification: null,
  notificationsEnabled: false,
  permissionStatus: 'unknown',
  clearBadge: () => {},
  syncDeviceToken: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, navigationRef }) => {
  const [badgeCount, setBadgeCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);
  const [bannerNotification, setBannerNotification] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const hideBannerTimerRef = useRef(null);
  const initialNotificationHandledRef = useRef(false);

  useEffect(() => {
    let foregroundSubscription = { remove: () => {} };
    let responseSubscription = { remove: () => {} };
    let unsubscribeTokenRefresh = () => {};

    const setup = async () => {
      await configureNotifications();

      const permission = await requestNotificationPermission();
      setPermissionStatus(permission.status);
      setNotificationsEnabled(permission.enabled);

      if (!permission.enabled) {
        return;
      }

      const currentToken = await getFcmToken();
      if (currentToken) {
        await syncFcmTokenToBackend(currentToken);
      }

      unsubscribeTokenRefresh = subscribeToTokenRefresh();

      foregroundSubscription = addNotificationReceivedListener((notification) => {
        const normalized = normalizeRemoteMessage(notification);
        if (!normalized) {
          return;
        }

        setLatestNotification(normalized);
        setBadgeCount((count) => count + 1);
        showBanner(normalized);
      });

      responseSubscription = addNotificationResponseListener((response) => {
        routeFromNotification(response?.notification?.request?.content?.data || {}, navigationRef);
      });

      if (!initialNotificationHandledRef.current) {
        initialNotificationHandledRef.current = true;
        const initialNotification = await getLastNotificationResponse();
        if (initialNotification) {
          routeFromNotification(initialNotification.notification?.request?.content?.data || {}, navigationRef);
        }
      }
    };

    setup();

    return () => {
      if (hideBannerTimerRef.current) {
        clearTimeout(hideBannerTimerRef.current);
      }
      foregroundSubscription.remove();
      responseSubscription.remove();
      unsubscribeTokenRefresh();
    };
  }, [bannerOpacity, navigationRef]);

  const clearBadge = () => {
    setBadgeCount(0);
    clearSystemBadgeCount();
  };

  const syncDeviceToken = async () => {
    if (!notificationsEnabled) {
      return { success: false, reason: 'disabled' };
    }

    return syncFcmTokenToBackend();
  };

  const contextValue = useMemo(
    () => ({
      badgeCount,
      latestNotification,
      notificationsEnabled,
      permissionStatus,
      clearBadge,
      syncDeviceToken,
    }),
    [badgeCount, latestNotification, notificationsEnabled, permissionStatus]
  );

  const handleBannerPress = () => {
    if (!bannerNotification) {
      return;
    }

    hideBanner();
    routeFromNotification(bannerNotification.data || {}, navigationRef);
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {bannerNotification ? (
        <Animated.View style={[styles.bannerWrapper, { opacity: bannerOpacity }]} pointerEvents="box-none">
          <TouchableOpacity activeOpacity={0.92} onPress={handleBannerPress} style={styles.bannerCard}>
            <Text style={styles.bannerLabel}>New alert</Text>
            <Text style={styles.bannerTitle} numberOfLines={1}>{bannerNotification.title}</Text>
            {bannerNotification.body ? (
              <Text style={styles.bannerBody} numberOfLines={2}>{bannerNotification.body}</Text>
            ) : null}
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </NotificationContext.Provider>
  );

  function showBanner(notification) {
    setBannerNotification(notification);
    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    if (hideBannerTimerRef.current) {
      clearTimeout(hideBannerTimerRef.current);
    }

    hideBannerTimerRef.current = setTimeout(() => {
      hideBanner();
    }, 4000);
  }

  function hideBanner() {
    Animated.timing(bannerOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setBannerNotification(null);
    });
  }
};

function routeFromNotification(data, navigationRef) {
  if (!navigationRef?.current) {
    return;
  }

  const target = getNotificationTarget(data);

  if (target?.routeName) {
    navigationRef.current.navigate(target.routeName, target.params);
  }
}

const styles = StyleSheet.create({
  bannerWrapper: {
    position: 'absolute',
    top: Platform.select({ ios: 58, android: 24, default: 24 }),
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  bannerCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerLabel: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerBody: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
});
