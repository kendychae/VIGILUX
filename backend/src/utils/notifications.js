/**
 * Push Notification Service
 * Issue #52 - W5: Backend Notification Service with FCM + Preferences API
 *
 * Routes push delivery through Expo for Expo tokens and Firebase Admin for
 * native FCM tokens. Invalid/stale tokens are removed from the database.
 */
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
const db = require('../config/database');

const expo = new Expo();

// Initialise firebase-admin once (idempotent)
function initFirebase() {
  if (admin.apps.length > 0) return; // already initialised

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('[FCM] Firebase Admin initialised from FIREBASE_SERVICE_ACCOUNT_JSON');
      return;
    } catch (e) {
      console.warn('[FCM] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
    }
  }

  // Fall back to application default credentials (works on GCP / emulator)
  try {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    console.log('[FCM] Firebase Admin initialised with application default credentials');
  } catch (e) {
    console.warn('[FCM] Firebase Admin not initialised — push notifications disabled:', e.message);
  }
}

initFirebase();

/**
 * Send a push notification to a specific user.
 * Looks up all stored push tokens for the user and sends through the provider
 * that matches each token.
 *
 * @param {string} userId  - UUID of the recipient
 * @param {string} title   - Notification title
 * @param {string} body    - Notification body
 * @param {object} data    - Optional key/value data payload
 * @returns {Promise<{sent: number, failed: number}>}
 */
async function sendToUser(userId, title, body, data = {}) {
  // Fetch user's push tokens
  const { rows: tokenRows } = await db.query(
    'SELECT id, token, provider FROM fcm_tokens WHERE user_id = $1',
    [userId]
  );

  if (tokenRows.length === 0) return { sent: 0, failed: 0 };

  const expoRows = [];
  const fcmRows = [];

  tokenRows.forEach((row) => {
    const provider = row.provider || (Expo.isExpoPushToken(row.token) ? 'expo' : 'fcm');
    if (provider === 'expo') {
      expoRows.push(row);
    } else {
      fcmRows.push(row);
    }
  });

  let sent = 0;
  let failed = 0;

  if (expoRows.length > 0) {
    const expoResult = await sendExpoPushMessages(expoRows, title, body, data);
    sent += expoResult.sent;
    failed += expoResult.failed;
  }

  if (fcmRows.length > 0) {
    const fcmResult = await sendFcmPushMessages(fcmRows, title, body, data);
    sent += fcmResult.sent;
    failed += fcmResult.failed;
  }

  return { sent, failed };
}

async function sendExpoPushMessages(tokenRows, title, body, data) {
  const messages = [];
  const invalidTokenIds = [];

  tokenRows.forEach(({ id, token }) => {
    if (!Expo.isExpoPushToken(token)) {
      invalidTokenIds.push(id);
      return;
    }

    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
    });
  });

  let sent = 0;
  let failed = invalidTokenIds.length;
  const staleTokenIds = [...invalidTokenIds];

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket, index) => {
        if (ticket.status === 'ok') {
          sent++;
          return;
        }

        failed++;
        const token = chunk[index]?.to;
        const matchingRow = tokenRows.find((row) => row.token === token);
        if (
          matchingRow &&
          ticket.details?.error &&
          ['DeviceNotRegistered', 'MessageTooBig', 'MismatchSenderId', 'InvalidCredentials'].includes(ticket.details.error)
        ) {
          staleTokenIds.push(matchingRow.id);
        }

        console.error('[Expo Push] Ticket error:', ticket.details?.error || ticket.message);
      });
    } catch (error) {
      failed += chunk.length;
      console.error('[Expo Push] Send chunk error:', error.message);
    }
  }

  await deleteTokensById(staleTokenIds, 'Expo');

  return { sent, failed };
}

async function sendFcmPushMessages(tokenRows, title, body, data) {
  if (!admin.apps.length) {
    console.warn('[FCM] Skipping native FCM delivery — Firebase not initialised');
    return { sent: 0, failed: tokenRows.length };
  }

  const messaging = admin.messaging();
  const staleTokenIds = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    tokenRows.map(async ({ id: tokenId, token }) => {
      const message = {
        token,
        notification: { title, body },
        data: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default' } } },
      };

      try {
        await messaging.send(message);
        sent++;
      } catch (err) {
        failed++;
        // Remove unregistered / invalid tokens
        if (
          err.code === 'messaging/registration-token-not-registered' ||
          err.code === 'messaging/invalid-registration-token'
        ) {
          staleTokenIds.push(tokenId);
        } else {
          console.error('[FCM] Send error for token', tokenId, err.code);
        }
      }
    })
  );

  // Clean up stale tokens
  if (staleTokenIds.length > 0) {
    await deleteTokensById(staleTokenIds, 'FCM');
  }

  return { sent, failed };
}

async function deleteTokensById(tokenIds, providerLabel) {
  const uniqueTokenIds = [...new Set(tokenIds)].filter(Boolean);
  if (uniqueTokenIds.length === 0) {
    return;
  }

  await db.query(
    'DELETE FROM fcm_tokens WHERE id = ANY($1::uuid[])',
    [uniqueTokenIds]
  );

  console.log(`[${providerLabel}] Removed ${uniqueTokenIds.length} stale token(s)`);
}

/**
 * Persist a notification record in the DB and push to device.
 *
 * @param {string} userId
 * @param {string} title
 * @param {string} body
 * @param {string} type        - e.g. 'report_status_change', 'report_assigned'
 * @param {string|null} reportId
 * @param {object} data        - extra FCM data payload
 */
async function notify(userId, title, body, type, reportId = null, data = {}) {
  // 1. Check user's notification preferences
  const { rows: prefRows } = await db.query(
    'SELECT push_enabled, status_changes FROM notification_preferences WHERE user_id = $1',
    [userId]
  );

  if (prefRows.length > 0) {
    const prefs = prefRows[0];
    if (!prefs.push_enabled) return;
    if (type === 'report_status_change' && !prefs.status_changes) return;
  }

  // 2. Store notification in DB
  await db.query(
    `INSERT INTO notifications (user_id, title, message, type, related_report_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, title, body, type, reportId]
  );

  // 3. Send push
  return sendToUser(userId, title, body, { type, reportId: reportId || '', ...data });
}

module.exports = { sendToUser, notify };
