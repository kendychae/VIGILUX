# CSE 499 Sprint Record

**Week 5**

This record is for (Put an X on one): **_ W03 Sprint 1 | _** W04 Sprint 2 | **_X_ W05 Sprint 3** | \_\_\_ W06 Sprint 4

---

## Accountability Record

Record each team member's activity. Each team member should open the document on their own computer and type their name in the column for the activity they participated in as a signature that they affirm they completed the activity.

| Person               | Completed Planning (by Tuesday) | Attended Standup     |
| -------------------- | ------------------------------- | -------------------- |
| Kendahl Chae Bingham | Kendahl Chae Bingham            | Kendahl Chae Bingham |
| Samuel Iyen Evbosaru | Samuel Iyen Evbosaru            | Samuel Iyen Evbosaru |
| Brenden Taylor Lyon  | Brenden Taylor Lyon             | Brenden Taylor Lyon  |
| Figuelia Ya'Sin      | Figuelia Ya'Sin                 | Figuelia Ya'Sin      |

---

## Sprint Planning

No later than Tuesday each team member should record what features they will be working on for the sprint.

### Feature 1: Push Notifications System

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                                  | Est. Hours |
| -------------------- | -------------------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Design notification architecture and event triggers            | 5          |
| Kendahl Chae Bingham | Configure Firebase Cloud Messaging project setup               | 4          |
| Samuel Iyen Evbosaru | Implement notification service on backend with FCM integration | 8          |
| Samuel Iyen Evbosaru | Create notification preferences table and API endpoints        | 5          |
| Brenden Taylor Lyon  | Integrate FCM in React Native app with permission handling     | 7          |
| Brenden Taylor Lyon  | Build notification settings screen UI                          | 5          |
| Figuelia Ya'Sin      | Implement notification listener and display logic              | 6          |
| Figuelia Ya'Sin      | Create notification history screen                             | 5          |

### Feature 2: Report Status Tracking System

**Lead:** Samuel Iyen Evbosaru

| Person Assigned      | Task Name & Brief Description                               | Est. Hours |
| -------------------- | ----------------------------------------------------------- | ---------- |
| Samuel Iyen Evbosaru | Create report status transitions and validation logic       | 6          |
| Samuel Iyen Evbosaru | Implement PATCH /api/reports/:id/status endpoint            | 5          |
| Samuel Iyen Evbosaru | Build status history tracking table and queries             | 4          |
| Kendahl Chae Bingham | Define role-based permissions for status updates            | 4          |
| Brenden Taylor Lyon  | Create status timeline UI component                         | 6          |
| Brenden Taylor Lyon  | Build report detail screen with status information          | 7          |
| Figuelia Ya'Sin      | Implement real-time status updates using WebSockets/polling | 7          |

### Feature 3: User Profile and Settings

**Lead:** Brenden Taylor Lyon

| Person Assigned      | Task Name & Brief Description                                    | Est. Hours |
| -------------------- | ---------------------------------------------------------------- | ---------- |
| Brenden Taylor Lyon  | Build user profile screen with editable fields                   | 7          |
| Brenden Taylor Lyon  | Create settings screen with preferences (notifications, privacy) | 6          |
| Samuel Iyen Evbosaru | Implement PUT /api/users/profile endpoint                        | 4          |
| Samuel Iyen Evbosaru | Create user preferences and settings storage                     | 4          |
| Figuelia Ya'Sin      | Add profile image upload and cropping functionality              | 6          |
| Figuelia Ya'Sin      | Implement change password feature                                | 4          |
| Kendahl Chae Bingham | Design privacy settings and data control options                 | 3          |

### Feature 4: Offline Support and Caching

**Lead:** Figuelia Ya'Sin

| Person Assigned      | Task Name & Brief Description                            | Est. Hours |
| -------------------- | -------------------------------------------------------- | ---------- |
| Figuelia Ya'Sin      | Implement AsyncStorage caching for reports and user data | 6          |
| Figuelia Ya'Sin      | Create offline queue for report submissions              | 7          |
| Brenden Taylor Lyon  | Add network status detection and offline indicators      | 4          |
| Samuel Iyen Evbosaru | Optimize API responses with proper caching headers       | 3          |
| Kendahl Chae Bingham | Define data sync strategy and conflict resolution rules  | 4          |

---

## Standup

Record the results of your standup meeting.

| Person               | Feature/Task                         | Progress Notes                                                                                   | Blockers/Help Needed |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ | -------------------- |
| Kendahl Chae Bingham | RBAC middleware (#45)                | Complete — role.middleware.js wired to PATCH /:id/status; 7 unit tests passing                   | None                 |
| Kendahl Chae Bingham | Offline sync spec (#48)              | Complete — docs/OFFLINE-SYNC.md written with queue schema, retry/backoff, idempotency key spec   | None                 |
| Kendahl Chae Bingham | PR #57 code review & merge           | Complete — reviewed Brenden's FCM + ReportDetailScreen PR; fast-forward merged to main           | None                 |
| Samuel Iyen Evbosaru | FCM Backend / Notification Service   | Complete — notifications.js refactored; Expo + native FCM routing; stale token cleanup           | None                 |
| Samuel Iyen Evbosaru | Status Transitions Logic             | Complete — state machine with PATCH /:id/status, report_status_history table and queries         | None                 |
| Brenden Taylor Lyon  | FCM React Native Integration (#50)   | Complete — notificationService.js; permission request, token sync on login/logout, deep-link tap | None                 |
| Brenden Taylor Lyon  | ReportDetailScreen + Status UI (#51) | Complete — vertical timeline, MediaPreview, pull-to-refresh, Edit button for owner, empty state  | None                 |
| Figuelia Ya'Sin      | Notification History Screen (#54)    | Complete — paginated list, mark-as-read, swipe delete, empty state                               | None                 |
| Figuelia Ya'Sin      | Offline Queue Implementation         | Spec delivered in OFFLINE-SYNC.md; implementation begins next sprint                             | None                 |

---

## Sprint Goals Summary

**Sprint Duration:** Week 5 (March 24-30, 2026)  
**Sprint Lead:** Kendahl Chae Bingham

### Primary Objectives:

1. ✅ Implement push notifications for report status changes
2. ✅ Build report status tracking with timeline history
3. ✅ Create user profile and settings management
4. ✅ Add offline support with data caching
5. ✅ Establish role-based permissions system

### Team Member Responsibilities:

**Kendahl Chae Bingham (Team Lead):**

- Design notification architecture and event triggers
- Set up Firebase Cloud Messaging infrastructure
- Define role-based permissions for status updates
- Design privacy settings and data controls
- Plan data synchronization strategy
- Total estimated hours: 20

**Samuel Iyen Evbosaru (Backend Developer):**

- Integrate FCM notification service with backend
- Implement status tracking and transition logic
- Create notification preferences and settings APIs
- Build user profile update endpoints
- Optimize API responses with caching headers
- Total estimated hours: 39

**Brenden Taylor Lyon (Frontend Developer):**

- Integrate FCM in React Native with permissions
- Build notification and settings screens
- Create status timeline UI components
- Design and implement profile management screen
- Add network status indicators
- Total estimated hours: 42

**Figuelia Ya'Sin (Full-Stack Developer):**

- Implement notification listener and history
- Build real-time status update mechanism
- Add profile image upload and cropping
- Create offline queue and caching system
- Implement password change functionality
- Total estimated hours: 41

### Success Criteria:

- ✅ Users receive push notifications for report updates (foreground banner, background tray, killed deep-link)
- ✅ Report status can be tracked with full history timeline (ReportDetailScreen vertical timeline)
- ✅ FCM device token registered on login, removed on logout
- ✅ Role-based permissions properly restrict status updates (citizen→403, officer→limited set, admin→full)
- ✅ RBAC unit tests cover all 7 role/transition matrix combinations
- ✅ Offline sync spec documented in docs/OFFLINE-SYNC.md with queue schema, backoff strategy, and idempotency approach
- ✅ Provider-aware push token storage (Expo + native FCM) in database
- ✅ All features tested and merged to main + kendahlbingham branches
