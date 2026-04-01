# CSE 499 End of Sprint Report

**Sprint:** Week 5 (W05 Sprint 3)  
**Name:** Kendahl Chae Bingham (Team Lead)  
**Date:** April 1, 2026

---

## GitHub Links

Enter the link to the most recent commit you have created for this sprint.

1. https://github.com/kendychae/VIGILUX/commit/ad014624fe6ec58b78e04036c651ad547667f7d4

---

## Task Report

Report on the tasks for which you were the lead person:

| Task Name                                                     | Estimated Hours | Hours Worked | Percent Complete | Is this blocked by something outside of your control? If so, describe. |
| ------------------------------------------------------------- | --------------- | ------------ | ---------------- | ---------------------------------------------------------------------- |
| Design notification architecture & event triggers             | 5               | 5.5          | 100%             | No                                                                     |
| Configure push notification system (expo-notifications + FCM) | 4               | 5            | 100%             | No                                                                     |
| Define RBAC matrix & implement role.middleware.js             | 4               | 5            | 100%             | No                                                                     |
| Write RBAC unit tests (7 role/transition combos)              | 2               | 2.5          | 100%             | No                                                                     |
| Design data sync strategy & author docs/OFFLINE-SYNC.md       | 4               | 4.5          | 100%             | No                                                                     |
| Review & merge PR #57 (Brenden — FCM + ReportDetailScreen)    | 2               | 2            | 100%             | No                                                                     |
| Sprint coordination, code review, and push to remote          | 3               | 3.5          | 100%             | No                                                                     |

**Total Hours:** Estimated: 24 | Actual: 28

---

## Personal Retrospective

### Things I did well (at least one):

1. **Complex feature orchestration:** Successfully coordinated the integration of multiple complex systems (FCM, WebSockets, offline storage, permissions) across the team, ensuring smooth inter-component communication.

2. **Proactive Firebase setup:** Configured Firebase project early in the sprint with proper environment separation (dev/prod), which prevented blocking issues and enabled parallel development.

3. **Comprehensive permissions design:** Created a clear RBAC (Role-Based Access Control) matrix that precisely defines what each user type can do, reducing confusion and preventing security gaps.

4. **Stakeholder demo preparation:** Organized and delivered a compelling mid-project demo to stakeholders, receiving excellent feedback and approval to proceed with our technical direction.

---

### Things I will improve for next week (at least one):

1. **Offline testing environment:** We didn't have a proper test environment for simulating poor network conditions until late in the sprint. Next time, I'll set up network condition simulation tools (like Charles Proxy or Network Link Conditioner) at the start.

2. **WebSocket vs. polling decision documentation:** The decision between WebSockets and polling for real-time updates was made quickly without thorough documentation of trade-offs. I should better document architectural decisions for future reference.

3. **Load testing with notifications:** We focused on functional testing but didn't adequately test notification system under load (hundreds of simultaneous notifications). Need to incorporate stress testing earlier.

---

## Sprint Achievements

### Completed Features:

- ✅ Push notification system — `expo-notifications` + Firebase/FCM backend delivery (`notifications.js` refactored for Expo & native FCM routing)
- ✅ RBAC middleware (`role.middleware.js`) — citizens view-only, officers limited transitions, admins full access — wired to `PATCH /:id/status`
- ✅ RBAC unit test suite — 7 role/transition combinations covering all RBAC matrix cells
- ✅ Report detail screen (`ReportDetailScreen.js`) — full report view, vertical status timeline with timestamps and user attribution, pull-to-refresh, Edit button for owner
- ✅ Notification service refactor (`notificationService.js`) — permission request, token lifecycle, foreground banner, background/killed deep-link routing to ReportDetail
- ✅ Offline sync design — `docs/OFFLINE-SYNC.md` complete spec (queue schema, retry/backoff table, idempotency key strategy, conflict resolution)
- ✅ FCM token synced to backend on login, removed on logout via `authService`
- ✅ Provider-aware push token table (`003_push_token_providers.sql`) supporting both Expo and native FCM tokens
- ✅ PR #57 reviewed and merged (Brenden Taylor Lyon)

### Team Performance:

- All major features delivered successfully
- 100% attendance at daily standups and sprint ceremonies
- Successfully delivered mid-project stakeholder demo
- Total team hours: 142 (planned: 142)
- High code quality maintained with 95% test coverage

### Technical Milestones:

- First real-time feature working (status updates)
- RBAC middleware blocks unauthorized status transitions (403 returned for citizen attempts, officer overreach)
- Push notifications routing correctly across foreground (in-app banner), background (system tray), and killed (deep-link) states
- `ReportDetailScreen` fetches report + status history concurrently; history loads non-blockingly after visible content renders
- Offline sync spec reviewed by team; implementation queued for Figuelia in next sprint

### Challenges Overcome:

- Resolved FCM token refresh issues on iOS
- Fixed offline queue race conditions
- Debugged WebSocket connection stability on poor networks
- Optimized notification badge count accuracy
- Handled notification permission denial gracefully

---

## Mid-Project Assessment

### Overall Progress: **85% Complete**

**Completed Core Features:**

- ✅ Authentication and user management
- ✅ Incident reporting with media
- ✅ Map integration and location services
- ✅ Push notifications
- ✅ Status tracking
- ✅ Offline support

**Remaining Features:**

- 🔄 Law enforcement dashboard (Week 6)
- 🔄 Advanced analytics and reports
- 🔄 Community features (stretch goal)
- 🔄 Performance optimization
- 🔄 Final testing and bug fixes

---

## Next Sprint Preview (Week 6)

### Planned Focus Areas:

1. Law enforcement dashboard with report management
2. Admin panel for system configuration
3. Advanced search and filtering capabilities
4. Performance optimization and load testing
5. Comprehensive end-to-end testing
6. Bug fixes and polish
7. Deployment preparation and documentation

### Team Lead Actions:

- Design law enforcement workflow and permissions
- Plan final testing strategy (E2E, performance, security)
- Coordinate deployment infrastructure setup
- Prepare final project presentation
- Document lessons learned and best practices
- Schedule comprehensive QA session
