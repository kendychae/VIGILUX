# CSE 499 Sprint Record

**Week 3**

This record is for (Put an X on one): **_X_ W03 Sprint 1** | **_ W04 Sprint 2 | _** W05 Sprint 3 | \_\_\_ W06 Sprint 4

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

### Feature 1: User Authentication System

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                               | Est. Hours |
| -------------------- | ----------------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Design authentication flow and coordinate implementation    | 6          |
| Samuel Iyen Evbosaru | Implement JWT token generation and validation middleware    | 8          |
| Samuel Iyen Evbosaru | Create user registration API endpoint with password hashing | 6          |
| Brenden Taylor Lyon  | Build login screen UI with form validation                  | 8          |
| Brenden Taylor Lyon  | Implement authentication state management in React Native   | 6          |
| Figuelia Ya'Sin      | Create secure token storage using AsyncStorage/SecureStore  | 5          |
| Figuelia Ya'Sin      | Integrate login API with frontend authentication flow       | 5          |

### Feature 2: Database Schema Setup

**Lead:** Samuel Iyen Evbosaru

| Person Assigned      | Task Name & Brief Description                            | Est. Hours |
| -------------------- | -------------------------------------------------------- | ---------- |
| Samuel Iyen Evbosaru | Design and implement users table with proper constraints | 4          |
| Samuel Iyen Evbosaru | Create reports table with foreign key relationships      | 4          |
| Kendahl Chae Bingham | Review database schema and ensure normalization          | 2          |
| Figuelia Ya'Sin      | Create database migration scripts and seed data          | 4          |
| Figuelia Ya'Sin      | Test database connectivity and CRUD operations           | 3          |

### Feature 3: Basic Navigation Structure

**Lead:** Brenden Taylor Lyon

| Person Assigned      | Task Name & Brief Description                              | Est. Hours |
| -------------------- | ---------------------------------------------------------- | ---------- |
| Brenden Taylor Lyon  | Set up React Navigation with tab and stack navigators      | 6          |
| Brenden Taylor Lyon  | Create placeholder screens (Home, Map, Report, Profile)    | 5          |
| Kendahl Chae Bingham | Design app navigation flow and screen hierarchy            | 3          |
| Figuelia Ya'Sin      | Implement protected route guards for authenticated screens | 4          |
| Figuelia Ya'Sin      | Add navigation animations and transitions                  | 3          |

---

## Standup

Record the results of your standup meeting.

| Person               | Feature/Task               | Progress Notes                                          | Blockers/Help Needed                    |
| -------------------- | -------------------------- | ------------------------------------------------------- | --------------------------------------- |
| Kendahl Chae Bingham | Authentication Flow Design | Completed UML diagrams and API endpoint specifications  | None                                    |
| Kendahl Chae Bingham | Database Schema Review     | In progress - reviewing normalization and relationships | None                                    |
| Samuel Iyen Evbosaru | JWT Middleware             | 80% complete - working on token refresh logic           | Need clarification on token expiry time |
| Samuel Iyen Evbosaru | Users Table Implementation | Completed with constraints and indexes                  | None                                    |
| Brenden Taylor Lyon  | Login Screen UI            | 60% complete - adding form validation                   | None                                    |
| Brenden Taylor Lyon  | React Navigation Setup     | Completed basic structure with placeholder screens      | None                                    |
| Figuelia Ya'Sin      | Secure Token Storage       | Completed implementation using Expo SecureStore         | None                                    |
| Figuelia Ya'Sin      | Database Migration Scripts | In progress - creating seed data for testing            | None                                    |

---

## Sprint Goals Summary

**Sprint Duration:** Week 3 (March 10-16, 2026)  
**Sprint Lead:** Kendahl Chae Bingham

### Primary Objectives:

1. ✅ Complete user authentication backend infrastructure
2. ✅ Build functional login screen with validation
3. ✅ Establish database schema and tables
4. ✅ Set up basic app navigation structure
5. ✅ Implement secure token storage mechanism

### Team Member Responsibilities:

**Kendahl Chae Bingham (Team Lead):**

- Oversee authentication system architecture and design
- Coordinate team activities and resolve blockers
- Review and approve database schema
- Design overall app navigation flow
- Total estimated hours: 11

**Samuel Iyen Evbosaru (Backend Developer):**

- Implement JWT authentication middleware
- Create user registration and login endpoints
- Design and implement core database tables
- Ensure proper error handling and validation
- Total estimated hours: 22

**Brenden Taylor Lyon (Frontend Developer):**

- Build login screen with form validation
- Implement authentication state management
- Set up React Navigation structure
- Create placeholder screens for main features
- Total estimated hours: 25

**Figuelia Ya'Sin (Full-Stack Developer):**

- Implement secure token storage solution
- Create database migration and seed scripts
- Integrate frontend with authentication APIs
- Implement protected route navigation guards
- Total estimated hours: 24

### Success Criteria:

- Users can successfully register and login
- JWT tokens are properly generated and validated
- Database schema supports all planned features
- App navigation flows smoothly between screens
- All code is committed and pushed to GitHub
