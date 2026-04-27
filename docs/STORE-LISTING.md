# VIGILUX — App Store & Play Store Listing Copy

This document is the source of truth for store metadata. Paste these fields into App Store Connect and Google Play Console during submission.

---

## App Identity

| Field                  | Value                                                            |
| ---------------------- | ---------------------------------------------------------------- |
| App name               | VIGILUX                                                          |
| Bundle ID (iOS)        | com.vigilux.app                                                  |
| Package name (Android) | com.vigilux.app                                                  |
| Version                | 1.0.0                                                            |
| Primary category       | Utilities                                                        |
| Secondary category     | News                                                             |
| Content rating         | 12+ (iOS) / Teen (Android) — references to crime / mature themes |

---

## Apple App Store

### Subtitle (max 30 chars)

```
Community Incident Reporting
```

### Promotional Text (max 170 chars)

```
Report incidents in seconds. Tag location, attach photos, and stay connected with local officers — all from one secure, offline-capable app.
```

### Description (max 4000 chars)

```
VIGILUX is a community-first incident reporting platform that connects citizens directly with local public-safety officers.

WHY VIGILUX
Traditional reporting channels are slow, fragmented, and hard to use during an emergency. VIGILUX gives you a single tap to log what happened, where, and when — with photos, GPS, and category tags attached automatically.

KEY FEATURES
• One-tap incident reporting with category, severity, and description
• Automatic GPS location tagging with map preview
• Attach photos from your camera or library as evidence
• Offline-first: reports queue locally and sync the moment you reconnect
• Real-time map of nearby reports with smart clustering
• Officer dashboard for triage, claiming, and status updates
• Push notifications for status changes on your reports
• Secure JWT authentication with role-based access (citizen / officer / admin)
• Full-text search across incidents you have access to

PRIVACY FIRST
VIGILUX collects only the data needed to file and route a report. Location is captured only when you create or view a report. You control your profile and can delete your account at any time.

WHO IT'S FOR
• Residents who want a fast, reliable way to report non-emergency incidents
• Neighborhood watch and community groups
• Public-safety officers who need a unified queue and triage tool
• Cities and agencies looking for a modern reporting layer

This app is intended to complement, not replace, emergency services. For life-threatening emergencies always call 911 (or your local emergency number).
```

### Keywords (max 100 chars, comma-separated)

```
incident,report,safety,community,crime,neighborhood,watch,police,patrol,alert,citizen,security
```

### What's New (1.0.0)

```
Initial public release.
• Citizen reporting with photo + GPS evidence
• Offline queue with automatic sync
• Officer triage dashboard
• Real-time map with clustering
• Full-text incident search
```

### URLs

| Field              | Value                       |
| ------------------ | --------------------------- |
| Support URL        | https://vigilux.app/support |
| Marketing URL      | https://vigilux.app         |
| Privacy Policy URL | https://vigilux.app/privacy |

### App Review Information

| Field                  | Value                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Demo account (citizen) | demo-citizen@vigilux.app / `Vigilux@Demo1`                                                                 |
| Demo account (officer) | demo-officer@vigilux.app / `Vigilux@Demo1`                                                                 |
| Notes                  | App requires location and camera permissions. Backend is publicly reachable; demo accounts are pre-seeded. |

### Required Screenshots

Capture clean, no-status-bar-clutter screenshots of these flows:

1. Welcome / Login
2. Map view with active reports + clustering
3. Create Report (form with photo attached)
4. Report Detail
5. Officer Dashboard

Sizes:

- 6.7" (iPhone 15 Pro Max) — 1290×2796
- 6.5" (iPhone 11 Pro Max) — 1242×2688
- 5.5" (iPhone 8 Plus) — 1242×2208
- iPad Pro 12.9" — 2048×2732

### App Privacy (Nutrition Labels)

| Data Type        | Linked to User | Used for Tracking | Purpose                            |
| ---------------- | -------------- | ----------------- | ---------------------------------- |
| Email Address    | Yes            | No                | App Functionality, Account         |
| Name             | Yes            | No                | App Functionality                  |
| Phone Number     | Yes (optional) | No                | App Functionality                  |
| Precise Location | Yes            | No                | App Functionality (report tagging) |
| Photos           | Yes            | No                | App Functionality (evidence)       |
| Crash Data       | No             | No                | App Functionality                  |
| Performance Data | No             | No                | Analytics                          |

### Export Compliance

- Uses standard HTTPS / TLS only
- No proprietary cryptography
- Qualifies for the encryption exemption under category 5D002

---

## Google Play Store

### Short Description (max 80 chars)

```
Report neighborhood incidents in seconds — with location, photos, and offline sync.
```

### Full Description (max 4000 chars)

Use the same long description as the App Store above.

### What's New (1.0.0)

Same as App Store release notes above.

### Categorization

| Field            | Value             |
| ---------------- | ----------------- |
| Application type | App               |
| Category         | Tools             |
| Tags             | Safety, Community |
| Target audience  | 13+               |
| Contains ads     | No                |
| In-app purchases | No                |

### Data Safety Form

| Question                                       | Answer               |
| ---------------------------------------------- | -------------------- |
| Does your app collect or share user data?      | Yes                  |
| Is all user data encrypted in transit?         | Yes (HTTPS/TLS 1.2+) |
| Do you provide a way to request data deletion? | Yes (in-app + email) |

Data collected:

- **Personal info** — Name, Email, Phone (optional). Collected, not shared. Required for account.
- **Location** — Approximate + Precise. Collected, not shared. Required for report tagging.
- **Photos and videos** — Photos. Collected, not shared. Optional, for evidence.
- **App activity** — App interactions, Crash logs. Collected, not shared. Optional, for analytics.
- **Device or other IDs** — Collected, not shared. For push notification routing.

### Content Rating Questionnaire (IARC)

- Violence: References only (no graphic depictions)
- User-generated content: Yes (reports may include photos and descriptions; moderated by officers/admins)
- Location sharing: Yes, with consent
- Expected rating: Teen / 13+

### Required Graphics

| Asset                             | Size                |
| --------------------------------- | ------------------- |
| App icon                          | 512×512 PNG (alpha) |
| Feature graphic                   | 1024×500 PNG/JPG    |
| Phone screenshots (min 2, max 8)  | 1080×1920 minimum   |
| 7" tablet screenshots (optional)  | 1200×1920           |
| 10" tablet screenshots (optional) | 1920×1200           |

### URLs

Same as App Store: support, marketing, privacy policy.

---

## Submission Checklist

- [ ] All env vars rotated and stored as EAS secrets (Iyen)
- [ ] Privacy policy & terms hosted at stable HTTPS URLs (Iyen)
- [ ] Final icon set + splash screens committed (Brenden)
- [ ] Screenshot set for all required device classes (Brenden)
- [ ] `eas build -p ios --profile production` succeeds
- [ ] `eas build -p android --profile production` succeeds
- [ ] App Store Connect listing complete; submitted for review
- [ ] Play Console listing complete; AAB on production track
- [ ] Demo accounts seeded on production database
- [ ] Release commit tagged on `main` (e.g. `v1.0.0`)
