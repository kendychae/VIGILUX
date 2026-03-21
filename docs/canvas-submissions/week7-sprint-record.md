# CSE 499 Sprint Record

**Week 7**

This record is for (Put an X on one): **_ W03 Sprint 1 | _** W04 Sprint 2 | \_\_ W05 Sprint 3 | \_\_\_ W06 Sprint 4 | **_X_ W07 Final Sprint**

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

### Feature 1: App Store Submission Preparation

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                                      | Est. Hours |
| -------------------- | ------------------------------------------------------------------ | ---------- |
| Kendahl Chae Bingham | Configure EAS Build for iOS (App Store) and Android (Play Store)   | 6          |
| Kendahl Chae Bingham | Create App Store Connect listing (metadata, screenshots, privacy)  | 8          |
| Kendahl Chae Bingham | Create Google Play Console listing (metadata, screenshots, rating) | 8          |
| Samuel Iyen Evbosaru | Set up production environment variables and secrets management     | 5          |
| Samuel Iyen Evbosaru | Deploy backend to production (Render/Railway/Heroku)               | 6          |
| Samuel Iyen Evbosaru | Configure production PostgreSQL with connection pooling            | 4          |
| Brenden Taylor Lyon  | Generate production app icon set and splash screen (final design)  | 6          |
| Brenden Taylor Lyon  | Capture App Store screenshots for all required device sizes        | 5          |
| Figuelia Ya'Sin      | Write App Store / Play Store privacy policy and terms of service   | 5          |
| Figuelia Ya'Sin      | Complete final accessibility audit (VoiceOver / TalkBack)          | 4          |

### Feature 2: Production Hardening and Final Bug Fixes

**Lead:** Samuel Iyen Evbosaru

| Person Assigned      | Task Name & Brief Description                                       | Est. Hours |
| -------------------- | ------------------------------------------------------------------- | ---------- |
| Samuel Iyen Evbosaru | Replace hardcoded API URL with EAS environment variable             | 2          |
| Samuel Iyen Evbosaru | Rotate all secrets (JWT, DB password) to production-strength values | 3          |
| Samuel Iyen Evbosaru | Move Google Maps API keys out of app.json into EAS secrets          | 2          |
| Samuel Iyen Evbosaru | Restrict CORS origins to production domain                          | 2          |
| Brenden Taylor Lyon  | Fix location subscription cleanup on MapScreen unmount              | 2          |
| Brenden Taylor Lyon  | Replace emoji tab icons with react-native-vector-icons              | 4          |
| Brenden Taylor Lyon  | Implement Edit Profile screen (currently stubbed out)               | 6          |
| Kendahl Chae Bingham | Add rate limiting middleware to all public API endpoints            | 3          |
| Figuelia Ya'Sin      | End-to-end smoke test on physical iOS and Android devices           | 6          |
| Figuelia Ya'Sin      | Verify offline behavior and error boundary coverage                 | 4          |

### Feature 3: Final Documentation and Handoff

**Lead:** Brenden Taylor Lyon

| Person Assigned      | Task Name & Brief Description                                        | Est. Hours |
| -------------------- | -------------------------------------------------------------------- | ---------- |
| Brenden Taylor Lyon  | Update README with final setup, demo, and contribution instructions  | 4          |
| Kendahl Chae Bingham | Write final project report and lessons-learned retrospective         | 5          |
| Samuel Iyen Evbosaru | Document production deployment and environment configuration process | 4          |
| Figuelia Ya'Sin      | Prepare final live demo script and walkthrough deck                  | 5          |
| All Team Members     | Final code review pass and merge to main                             | 3 each     |

---

## Standup

Record the results of your standup meeting.

| Person               | Feature/Task                          | Progress Notes                                                               | Blockers/Help Needed                            |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| Kendahl Chae Bingham | EAS Build Configuration               | 90% — iOS profile requires Apple Developer Account; provisioning in progress | Awaiting Apple team certificate approval        |
| Kendahl Chae Bingham | App Store Connect Listing             | Metadata drafted; screenshots pending final design assets                    | None                                            |
| Samuel Iyen Evbosaru | Production Backend Deployment         | Backend deployed to Render; DB migrations run successfully                   | None                                            |
| Samuel Iyen Evbosaru | API Hardening (CORS, JWT, rate limit) | Completed — all secrets rotated, CORS locked to production origin            | None                                            |
| Brenden Taylor Lyon  | App Icon & Splash Design              | Final brand assets in Figma; exporting to required PNG sizes                 | None                                            |
| Brenden Taylor Lyon  | React Native Vector Icons             | In progress — replacing emoji icons across all tab screens                   | None                                            |
| Figuelia Ya'Sin      | Device Smoke Testing                  | iOS physical device — all core flows passing; Android testing in progress    | Need Android test device with Play Store access |
| Figuelia Ya'Sin      | Privacy Policy Draft                  | Draft complete; pending legal review by instructor                           | None                                            |

---

## Sprint Goals Summary

| Goal                                          | Target | Current Status |
| --------------------------------------------- | ------ | -------------- |
| EAS Production Build (iOS) submitted to store | 100%   | 80%            |
| EAS Production Build (Android) uploaded       | 100%   | 85%            |
| Backend deployed to production host           | 100%   | 100%           |
| All critical bugs resolved                    | 100%   | 100%           |
| App Store / Play Store listings created       | 100%   | 70%            |
| Final documentation complete                  | 100%   | 90%            |
