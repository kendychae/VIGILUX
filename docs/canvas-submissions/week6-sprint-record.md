# CSE 499 Sprint Record

**Week 6**

This record is for (Put an X on one): **_ W03 Sprint 1 | _** W04 Sprint 2 | _\_\_ W05 Sprint 3 | \*\*\_X_ W06 Sprint 4\*\*

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

### Feature 1: Law Enforcement Dashboard

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                               | Est. Hours |
| -------------------- | ----------------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Design law enforcement workflow and permission structure    | 6          |
| Kendahl Chae Bingham | Create officer role management and assignment logic         | 5          |
| Samuel Iyen Evbosaru | Build officer dashboard API endpoints (GET /api/officer/\*) | 8          |
| Samuel Iyen Evbosaru | Implement report assignment and claiming system             | 6          |
| Samuel Iyen Evbosaru | Create priority queue and sorting algorithms                | 5          |
| Brenden Taylor Lyon  | Build officer dashboard screen with report queue            | 8          |
| Brenden Taylor Lyon  | Create report management interface (assign, update, close)  | 7          |
| Figuelia Ya'Sin      | Implement officer authentication and special permissions    | 6          |
| Figuelia Ya'Sin      | Build report investigation tools and note-taking features   | 6          |

### Feature 2: Advanced Search and Filtering

**Lead:** Samuel Iyen Evbosaru

| Person Assigned      | Task Name & Brief Description                         | Est. Hours |
| -------------------- | ----------------------------------------------------- | ---------- |
| Samuel Iyen Evbosaru | Implement full-text search on reports with PostgreSQL | 7          |
| Samuel Iyen Evbosaru | Create advanced filtering API with multiple criteria  | 6          |
| Samuel Iyen Evbosaru | Optimize database queries with proper indexing        | 5          |
| Brenden Taylor Lyon  | Build advanced search UI with filter chips            | 6          |
| Brenden Taylor Lyon  | Add search history and saved searches functionality   | 5          |
| Figuelia Ya'Sin      | Implement autocomplete suggestions for search         | 5          |

### Feature 3: Performance Optimization and Testing

**Lead:** Figuelia Ya'Sin

| Person Assigned      | Task Name & Brief Description                          | Est. Hours |
| -------------------- | ------------------------------------------------------ | ---------- |
| Figuelia Ya'Sin      | Conduct performance profiling and identify bottlenecks | 6          |
| Figuelia Ya'Sin      | Implement image lazy loading and pagination            | 5          |
| Figuelia Ya'Sin      | Optimize app bundle size and reduce dependencies       | 5          |
| Samuel Iyen Evbosaru | Add database connection pooling and query optimization | 5          |
| Samuel Iyen Evbosaru | Implement API rate limiting and request caching        | 4          |
| Brenden Taylor Lyon  | Optimize React component re-renders and memoization    | 5          |
| Kendahl Chae Bingham | Conduct load testing with Apache JMeter or Artillery   | 6          |

### Feature 4: Final Testing and Bug Fixes

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                         | Est. Hours |
| -------------------- | ----------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Coordinate comprehensive end-to-end testing           | 8          |
| Kendahl Chae Bingham | Perform security audit and vulnerability assessment   | 6          |
| All Team Members     | Execute cross-browser and cross-device testing        | 6 each     |
| All Team Members     | Fix identified bugs and address edge cases            | 8 each     |
| Brenden Taylor Lyon  | Polish UI/UX based on user feedback                   | 6          |
| Figuelia Ya'Sin      | Verify offline functionality and data sync edge cases | 5          |

### Feature 5: Documentation and Deployment

**Lead:** Kendahl Chae Bingham

| Person Assigned      | Task Name & Brief Description                           | Est. Hours |
| -------------------- | ------------------------------------------------------- | ---------- |
| Kendahl Chae Bingham | Write comprehensive README and deployment documentation | 6          |
| Kendahl Chae Bingham | Prepare final project presentation and demo             | 8          |
| Samuel Iyen Evbosaru | Create API documentation with Postman/Swagger           | 5          |
| Samuel Iyen Evbosaru | Write database schema documentation and migration guide | 4          |
| Brenden Taylor Lyon  | Create user guide and feature documentation             | 5          |
| Figuelia Ya'Sin      | Document troubleshooting guide and known issues         | 4          |
| All Team Members     | Review and update project documentation                 | 3 each     |

---

## Standup

Record the results of your standup meeting.

| Person               | Feature/Task             | Progress Notes                                                | Blockers/Help Needed |
| -------------------- | ------------------------ | ------------------------------------------------------------- | -------------------- |
| Kendahl Chae Bingham | Law Enforcement Workflow | Completed design with state transitions and permission matrix | None                 |
| Kendahl Chae Bingham | Load Testing Setup       | Configured Artillery, running initial test scenarios          | None                 |
| Samuel Iyen Evbosaru | Officer Dashboard API    | 85% complete - finalizing priority queue algorithm            | None                 |
| Samuel Iyen Evbosaru | Full-Text Search         | Implemented with PostgreSQL tsvector, testing performance     | None                 |
| Brenden Taylor Lyon  | Officer Dashboard UI     | 75% complete - working on drag-and-drop report assignment     | None                 |
| Brenden Taylor Lyon  | Advanced Search UI       | 90% complete - adding filter persistence                      | None                 |
| Figuelia Ya'Sin      | Performance Profiling    | Identified 3 major bottlenecks, implementing fixes            | None                 |
| Figuelia Ya'Sin      | Officer Authentication   | Completed with enhanced verification for law enforcement      | None                 |

---

## Sprint Goals Summary

**Sprint Duration:** Week 6 (March 31 - April 6, 2026)  
**Sprint Lead:** Kendahl Chae Bingham

### Primary Objectives:

1. ✅ Complete law enforcement dashboard and report management
2. ✅ Implement advanced search and filtering capabilities
3. ✅ Optimize application performance and scalability
4. ✅ Conduct comprehensive testing (E2E, security, load)
5. ✅ Complete all project documentation
6. ✅ Prepare final presentation and deployment

### Team Member Responsibilities:

**Kendahl Chae Bingham (Team Lead):**

- Design law enforcement workflow and permissions
- Coordinate comprehensive testing efforts
- Conduct security audit and load testing
- Write deployment and project documentation
- Prepare final presentation materials
- Lead project retrospective
- Total estimated hours: 51

**Samuel Iyen Evbosaru (Backend Developer):**

- Build complete officer dashboard API system
- Implement advanced search with full-text capabilities
- Optimize database performance with indexing and pooling
- Create comprehensive API documentation
- Write database schema documentation
- Participate in bug fixes and testing
- Total estimated hours: 64

**Brenden Taylor Lyon (Frontend Developer):**

- Build law enforcement dashboard interface
- Implement advanced search UI with filters
- Optimize frontend performance and rendering
- Polish UI/UX based on feedback
- Create user guide documentation
- Participate in cross-device testing and bug fixes
- Total estimated hours: 65

**Figuelia Ya'Sin (Full-Stack Developer):**

- Implement officer authentication system
- Build report investigation tools
- Conduct performance profiling and optimization
- Implement autocomplete search suggestions
- Write troubleshooting documentation
- Verify offline functionality and edge cases
- Participate in testing and bug fixes
- Total estimated hours: 63

### Success Criteria:

- Law enforcement officers can manage reports efficiently
- Advanced search returns results in <500ms
- App handles 1000+ concurrent users without degradation
- All critical user flows have E2E tests
- Security vulnerabilities identified and resolved
- Documentation is comprehensive and clear
- Application is ready for production deployment
- Final presentation demonstrates all features successfully

### Deployment Readiness Checklist:

- [ ] All features implemented and tested
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Error monitoring configured
- [ ] Backup strategy implemented
- [ ] User acceptance testing completed
- [ ] Final presentation prepared
