# VIGILUX — Offline Sync Strategy & Conflict Resolution

**Issue #48 — W5: Data Sync Strategy & Conflict Resolution Design**  
Assignees: Figuelia, kendychae  
Status: Specification complete — ready for implementation

---

## 1. Overview

VIGILUX users may submit or edit incident reports while offline (e.g. in areas with poor cellular coverage). When connectivity is restored the client must replay queued operations against the backend without creating duplicate submissions or silently losing data.

This document defines:

- The client-side queue schema
- Conflict resolution strategy
- Duplicate detection via idempotency keys
- Retry and backoff policy
- Sync trigger points

---

## 2. Conflict Resolution Strategy

VIGILUX adopts **optimistic conflict resolution** for new report submissions:

- The client generates a `clientId` (UUID v4) at the moment the user taps "Submit".
- This `clientId` is embedded in the POST body and sent to the server as an idempotency key.
- If the server has already processed a request with the same `clientId` it returns the existing resource (HTTP 200 with the original report) rather than creating a duplicate.
- The server enforces this by storing `client_id` in the `reports` table with a `UNIQUE` constraint.

For **report edits** (PATCH), optimistic concurrency is used:

- Each report carries an `updated_at` timestamp.
- The client sends `If-Unmodified-Since: <updated_at>` (or an `etag`) with PATCH requests.
- If the server detects a newer `updated_at` it responds with HTTP 412 Precondition Failed.
- The client surfaces a conflict UI: show the server version alongside the local edit and let the user choose which to keep.

---

## 3. Queue Schema

The offline queue is persisted in `AsyncStorage` under the key `vigilux_offline_queue`.

Each queue entry is a JSON object:

```json
{
  "id": "<uuid-v4>",
  "clientId": "<uuid-v4>",
  "operation": "CREATE_REPORT | PATCH_REPORT | PATCH_STATUS",
  "payload": {},
  "createdAt": "<ISO8601>",
  "retryCount": 0,
  "maxRetries": 5,
  "status": "pending | retrying | failed"
}
```

| Field        | Type    | Description                                                     |
| ------------ | ------- | --------------------------------------------------------------- |
| `id`         | UUID    | Unique queue entry identifier                                   |
| `clientId`   | UUID    | Idempotency key sent to the server; maps to `reports.client_id` |
| `operation`  | string  | One of `CREATE_REPORT`, `PATCH_REPORT`, `PATCH_STATUS`          |
| `payload`    | object  | Full request body to replay                                     |
| `createdAt`  | ISO8601 | When the entry was enqueued (used for ordering)                 |
| `retryCount` | integer | Number of delivery attempts so far                              |
| `maxRetries` | integer | Maximum attempts before marking `failed` (default **5**)        |
| `status`     | string  | Current entry state                                             |

---

## 4. Max Retry Attempts & Backoff Strategy

| Attempt | Delay before retry |
| ------- | ------------------ |
| 1       | 5 s                |
| 2       | 15 s               |
| 3       | 60 s               |
| 4       | 5 min              |
| 5       | 30 min             |

After the 5th failed attempt the entry is marked `status: "failed"` and the user is notified in-app with an option to manually retry or discard.  
The algorithm is **exponential backoff with jitter**: `delay = base * 2^(attempt-1) + rand(0, 1000)ms`.

Transient server errors (HTTP 5xx, network timeout) trigger a retry. Client errors (HTTP 4xx) that are not 429 are not retried — the entry is immediately marked `failed`.

---

## 5. Duplicate Detection

A `clientId` (UUID v4) is generated **client-side at creation time** — before the user taps "Submit" — and persisted with the queue entry.

Server-side the `reports` table has:

```sql
ADD COLUMN client_id UUID UNIQUE;
```

The POST `/api/v1/reports` endpoint:

1. Accepts an optional `clientId` field in the request body.
2. Attempts `INSERT ... ON CONFLICT (client_id) DO NOTHING RETURNING *`.
3. If no row is returned (conflict), queries for the existing report by `client_id` and returns it with HTTP 200.
4. This guarantees exactly-once creation semantics regardless of how many times the queued request is replayed.

---

## 6. Sync Trigger Points

The sync worker runs at the following points:

| Event                                             | Action                       |
| ------------------------------------------------- | ---------------------------- |
| App foregrounds (AppState `active`)               | Process entire queue         |
| Network reconnects (NetInfo `isConnected` → true) | Process entire queue         |
| User manually taps "Retry" on a failed entry      | Process that single entry    |
| App background (AppState `background`)            | Suspend — no background sync |

Queue processing is serialised (one entry at a time, oldest-first by `createdAt`) to avoid race conditions and to preserve the natural ordering of edits.

---

## 7. Implementation Notes for Figuelia

- **Queue persistence**: use `AsyncStorage` key `vigilux_offline_queue`. Wrap all reads/writes in `try/catch`.
- **Connectivity detection**: `@react-native-community/netinfo` — subscribe in the offline sync service and re-process on reconnect.
- **Idempotency key generation**: `import uuid from 'react-native-uuid'` or use `crypto.randomUUID()` (available in Hermes / RN 0.73+).
- **Entry ordering**: sort by `createdAt` ascending before processing.
- **Conflict UI**: a simple `Alert` with "Use server version" / "Keep my edit" buttons is sufficient for MVP.
- **Backend migration**: add `client_id UUID UNIQUE` to the `reports` table in a new migration file (`backend/src/database/migrations/004_client_id_idempotency.sql`).
- **Test coverage**: mock `NetInfo`, `AsyncStorage`, and `apiClient` in Jest; assert that replayed requests include `clientId` and that a 200 response on conflict does not enqueue a duplicate.
