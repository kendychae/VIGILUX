# CSE 499 Sprint Record

**Week 4**

This record is for (Put an X on one): **_ W03 Sprint 1 | \*\*\_X_ W04 Sprint 2\*\* | \_** W05 Sprint 3 | \_\_\_ W06 Sprint 4

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

### Feature 1: Incident Reporting System

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                               | Est. Hours |
| -------------------- | ----------------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Design report submission flow and API contracts             | 5          |
| Kendahl Chae Bingham | Set up testing framework (Jest) and write integration tests | 6          |
| Samuel Iyen Evbosaru | Create POST /api/reports endpoint with validation           | 7          |
| Samuel Iyen Evbosaru | Implement report listing with filtering (GET /api/reports)  | 6          |
| Brenden Taylor Lyon  | Build report submission form screen with validation         | 8          |
| Brenden Taylor Lyon  | Create report list screen with filter functionality         | 7          |
| Figuelia Ya'Sin      | Implement image picker and camera functionality             | 6          |
| Figuelia Ya'Sin      | Create image upload service with compression                | 5          |

### Feature 2: Map Integration with Location Services

**Lead:** Brenden Taylor Lyon

| Person Assigned      | Task Name & Brief Description                             | Est. Hours |
| -------------------- | --------------------------------------------------------- | ---------- |
| Brenden Taylor Lyon  | Integrate React Native Maps with location tracking        | 8          |
| Brenden Taylor Lyon  | Display user location and incident markers on map         | 6          |
| Kendahl Chae Bingham | Define map marker clustering algorithm and data structure | 4          |
| Figuelia Ya'Sin      | Implement GPS location capture for incident reports       | 5          |
| Figuelia Ya'Sin      | Add address lookup using reverse geocoding API            | 5          |
| Samuel Iyen Evbosaru | Create geospatial queries for nearby incidents            | 6          |

### Feature 3: File Upload and Storage

**Lead:** Samuel Iyen Evbosaru

| Person Assigned      | Task Name & Brief Description                                 | Est. Hours |
| -------------------- | ------------------------------------------------------------- | ---------- |
| Samuel Iyen Evbosaru | Set up Multer middleware for file uploads                     | 4          |
| Samuel Iyen Evbosaru | Implement file storage system with proper naming/organization | 5          |
| Samuel Iyen Evbosaru | Create media table and link to reports                        | 3          |
| Figuelia Ya'Sin      | Build media preview component for uploaded files              | 4          |
| Kendahl Chae Bingham | Define file validation rules (size, type, security)           | 3          |

---

## Standup

Record the results of your standup meeting.

| Person               | Feature/Task                  | Progress Notes                                                 | Blockers/Help Needed            |
| -------------------- | ----------------------------- | -------------------------------------------------------------- | ------------------------------- |
| Kendahl Chae Bingham | Report API Design             | Completed API documentation with request/response schemas      | None                            |
| Kendahl Chae Bingham | Testing Framework Setup       | Jest and Supertest configured, writing first integration tests | None                            |
| Samuel Iyen Evbosaru | Report POST Endpoint          | 75% complete - adding image URL storage                        | None                            |
| Samuel Iyen Evbosaru | File Upload Middleware        | Completed with file type validation                            | None                            |
| Brenden Taylor Lyon  | React Native Maps Integration | 90% complete - working on marker customization                 | Need API key for Google Maps    |
| Brenden Taylor Lyon  | Report Submission Form        | 70% complete - implementing validation feedback                | None                            |
| Figuelia Ya'Sin      | Image Picker Implementation   | Completed with camera and gallery options                      | None                            |
| Figuelia Ya'Sin      | GPS Location Capture          | In progress - testing location permission handling             | Need to test on physical device |

---

## Sprint Goals Summary

**Sprint Duration:** Week 4 (March 17-23, 2026)  
**Sprint Lead:** Kendahl Chae Bingham

### Primary Objectives:

1. ✅ Enable users to create and submit incident reports
2. ✅ Implement photo/video attachment functionality
3. ✅ Integrate map view with location tracking
4. ✅ Build report listing and filtering system
5. ✅ Establish automated testing infrastructure

### Team Member Responsibilities:

**Kendahl Chae Bingham (Team Lead):**

- Design report submission API contracts
- Set up Jest testing framework with integration tests
- Define map marker clustering strategy
- Establish file upload security and validation rules
- Coordinate sprint activities and resolve blockers
- Total estimated hours: 18

**Samuel Iyen Evbosaru (Backend Developer):**

- Create report submission and listing endpoints
- Implement file upload middleware with Multer
- Build geospatial queries for location-based features
- Create media storage table and relationships
- Total estimated hours: 31

**Brenden Taylor Lyon (Frontend Developer):**

- Integrate React Native Maps with location services
- Build report submission form with validation
- Create report listing screen with filters
- Display incident markers on interactive map
- Total estimated hours: 29

**Figuelia Ya'Sin (Full-Stack Developer):**

- Implement image picker and camera functionality
- Create image upload service with compression
- Add GPS location capture for reports
- Implement reverse geocoding for addresses
- Build media preview components
- Total estimated hours: 25

### Success Criteria:

- Users can create reports with photos from camera or gallery
- Reports are displayed on map with location markers
- Report listing shows all submissions with filter options
- File uploads are validated and stored securely
- Automated tests cover critical user flows
- All code passes review and is merged to main branch
