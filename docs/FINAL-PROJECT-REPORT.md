# VIGILUX — Final Project Report

**Course:** CSE 499 — Senior Project
**Team Lead:** Kendahl Chae Bingham
**Team:** Kendahl Chae Bingham, Samuel Iyen Evbosaru, Brenden Taylor Lyon, Figuelia Ya'Sin
**Reporting Date:** April 27, 2026
**Version:** 1.0.0 (App Store / Play Store submission candidate)

---

## 1. Executive Summary

VIGILUX is a cross-platform mobile application that lets community members report neighborhood incidents in seconds and lets local public-safety officers triage those reports from a single dashboard. Over four sprints we delivered a production-grade React Native app, a hardened Node.js/PostgreSQL backend, and a complete release pipeline. The codebase is currently being submitted to the Apple App Store and Google Play Store as version 1.0.0.

Sprint outcomes met or exceeded every stated goal: 100% of planned features shipped, ~95% backend / ~88% frontend test coverage, sub-200 ms average API response under 1,000 concurrent users, and zero unresolved critical-severity defects.

## 2. Goals vs. Outcomes

| Goal                                    | Target | Actual                                                       |
| --------------------------------------- | ------ | ------------------------------------------------------------ |
| Citizen reporting flow with photo + GPS | Yes    | Shipped                                                      |
| Officer triage dashboard                | Yes    | Shipped                                                      |
| Real-time map with clustering           | Yes    | Shipped                                                      |
| Offline-first sync                      | Yes    | Shipped (UUID idempotency, exponential backoff)              |
| Full-text incident search               | Yes    | Shipped (PostgreSQL `tsvector` + GIN)                        |
| Push notifications                      | Yes    | Shipped (Expo + APNs/FCM)                                    |
| OWASP-compliant security posture        | Yes    | Shipped (rate limiting, JWT rotation, helmet, CORS lockdown) |
| App Store / Play Store submission       | Week 8 | In flight                                                    |

## 3. Architecture

```
┌──────────────────┐     HTTPS      ┌──────────────────────┐
│  Expo / React    │ ─────────────▶ │  Express API (Node)  │
│  Native client   │ ◀───────────── │  helmet + rate limit │
│  (iOS / Android) │                │                      │
└──────────────────┘                └──────────┬───────────┘
        │                                      │
        │ Push (APNs/FCM via Expo)             │
        │                                      ▼
        │                          ┌──────────────────────┐
        │                          │   PostgreSQL 16      │
        │                          │  + GIN/tsvector idx  │
        │                          └──────────────────────┘
```

**Frontend** — Expo SDK 54, React Native 0.81, React Navigation 7, react-native-maps, AsyncStorage + NetInfo for offline queueing.
**Backend** — Node 18, Express 4, PostgreSQL 16, JWT (access + refresh), express-rate-limit, helmet, multer for media.
**Build & Deploy** — EAS Build for iOS/Android, Render for the API + database.

## 4. Sprint-by-Sprint Recap

### Week 3 — Sprint 1 (Foundations)

- Stood up PostgreSQL schema, JWT auth, citizen registration/login.
- React Native shell + bottom-tab navigation.

### Week 4 — Sprint 2 (Core reporting)

- Report creation with category/severity/description.
- Image upload pipeline with file-signature validation.
- Map view with markers.

### Week 5 — Sprint 3 (Maps + offline)

- Map clustering and performance pass.
- Offline queue v1 with NetInfo-driven flush.
- Push notifications wired through Expo.

### Week 6 — Sprint 4 (Officer + search + hardening)

- Officer dashboard API (assign/unclaim/queue) — Issue #58.
- E2E test suite + OWASP rate limiting on auth — Issue #59.
- Full-text search API and UI — Issues #60, #63.
- Officer Dashboard React Native UI — Issue #62.
- Offline queue rewrite with UUID idempotency keys + exponential backoff.

### Week 7 — Final Sprint (Polish + release prep)

- Production EAS profiles for iOS and Android with channel + autoIncrement.
- App Store / Play Store metadata, screenshot plan, privacy assets.
- Privacy Policy and Terms of Service authored and ready to host.
- Global API rate limiter; production env-var lockdown plan.
- Final documentation pass and tagged release candidate.

## 5. Key Technical Decisions

| Decision                                               | Why                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Expo (managed workflow) over bare RN                   | Faster iteration; OTA updates; first-class iOS/Android build matrix via EAS.                   |
| PostgreSQL + `tsvector` over a separate search service | Single source of truth; one migration; <150 ms search at our data scale.                       |
| UUID-based idempotency for offline queue               | Lets the server safely de-duplicate replayed POSTs without a server-side session.              |
| JWT access + refresh rotation                          | Short-lived access tokens minimize blast radius if leaked; rotation prevents long-lived theft. |
| Role-based middleware on every route                   | Defense in depth — an authn bug cannot become an authz bug.                                    |
| EAS secrets for all credentials                        | Keeps API keys out of git history and CI logs.                                                 |

## 6. Security Posture (OWASP Top 10 coverage)

| Risk                       | Mitigation                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| A01 Broken Access Control  | Role middleware on every protected route; resource-ownership checks.                                              |
| A02 Cryptographic Failures | Bcrypt for passwords, TLS 1.2+ end-to-end, JWT rotation, no secrets in repo.                                      |
| A03 Injection              | Parameterized SQL only; express-validator on every body field; multer file-signature checks.                      |
| A04 Insecure Design        | Threat model documented; abuse cases enumerated.                                                                  |
| A05 Misconfiguration       | helmet defaults; CORS lockdown to prod origin; NODE_ENV gating; production startup guard rejects default secrets. |
| A06 Vulnerable Components  | `npm audit` clean at release; Dependabot enabled.                                                                 |
| A07 Identification/Auth    | Auth-endpoint rate limiting; 8-char complexity policy; password reset via signed tokens.                          |
| A08 Data Integrity         | Idempotency keys on writes; row-level audit columns.                                                              |
| A09 Logging & Monitoring   | Structured request logs; error stack capture.                                                                     |
| A10 SSRF                   | All outbound calls are to a fixed allowlist (Expo push, Maps tile servers).                                       |

## 7. Quality Metrics

| Metric                                             | Result     |
| -------------------------------------------------- | ---------- |
| Backend test coverage                              | ~95% lines |
| Frontend test coverage                             | ~88% lines |
| Automated test cases                               | 180+       |
| Average API response time (1,000 concurrent users) | <200 ms    |
| Full-text search latency                           | <150 ms    |
| Bundle size (production)                           | ~15 MB     |
| Critical defects open at release                   | 0          |

## 8. Team Contributions

| Person               | Primary contributions                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kendahl Chae Bingham | Team lead, project planning, officer dashboard (API + UI), full-text search, security audit, EAS production pipeline, store submission, documentation. |
| Samuel Iyen Evbosaru | Backend deployment, secrets/env hardening, CORS lockdown, JWT rotation, production database tuning.                                                    |
| Brenden Taylor Lyon  | Core reporting UI, map screen, vector-icon migration, edit-profile screen, app icon and splash assets, screenshot capture.                             |
| Figuelia Ya'Sin      | Privacy policy / TOS drafting, accessibility audit (VoiceOver / TalkBack), end-to-end smoke testing on physical iOS and Android devices.               |

## 9. Lessons Learned

**What worked**

- Tight sprint loop (plan Tuesday, standup mid-week, retro Sunday) kept velocity steady across all four sprints.
- Investing early in middleware abstractions (auth, validation, role, upload) paid off every sprint after.
- Keeping documentation in the repo, not in scattered docs, made onboarding new code trivial.

**What I would change next time**

1. **Performance testing earlier.** We caught hot paths in Week 6; doing a load-test pass in Week 4 would have de-risked the search and dashboard work.
2. **CI/CD from day one.** Manual deploys cost us hours late in the project. A GitHub Actions pipeline for tests + EAS preview builds should be a Sprint-1 deliverable.
3. **UAT in Week 5, not Week 7.** We had time to act on instructor feedback; we did not have time to act on real-user feedback. Earlier UAT would have surfaced UX issues sooner.
4. **One config source for Expo.** Maintaining both `app.json` and `app.config.js` invited drift. Future projects should pick `app.config.js` (or `.ts`) and delete `app.json`.

## 10. Future Roadmap

- Server-side push fan-out for incident broadcasts to nearby users.
- Two-way messaging between citizens and assigned officers.
- Native iOS widget + Android tile for one-tap reporting.
- ML-assisted incident categorization at submit time.
- Web admin console for agency administrators.

## 11. Conclusion

VIGILUX is a complete, production-quality mobile platform delivered on schedule and within scope. The codebase, infrastructure, documentation, and store assets are all release-ready for v1.0.0 submission. The team's discipline around testing, security, and documentation leaves the project in a strong position for any successor team to extend or operate.

— **Kendahl Chae Bingham**, Team Lead
