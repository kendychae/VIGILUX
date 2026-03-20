# Week 4 Team Coordination and Sprint Management

## Sprint Overview

**Sprint:** Week 4  
**Duration:** March 18-24, 2026  
**Focus:** Report Submission & Media Upload Features  
**Team Lead:** Kendahl Bingham

---

## Daily Standup Schedule

### Time and Format

- **Time:** 9:00 AM PST (Daily)
- **Duration:** 15 minutes max
- **Format:** Synchronous (Video/Voice) or Asynchronous (Slack/Discord)

### Standup Template

Each team member answers:

1. **What I completed yesterday:**
2. **What I'm working on today:**
3. **Any blockers or help needed:**

### Example Standup Update

```
Kendahl - March 20, 2026

Yesterday:
✅ Completed API documentation for report submission
✅ Defined file validation rules and security guidelines
✅ Created map clustering algorithm specification

Today:
🔄 Implementing Multer middleware for file uploads
🔄 Creating POST /api/reports endpoint with validation
🔄 Setting up Jest testing framework

Blockers:
⚠️ Need Google Maps API key for iOS and Android testing
⚠️ Waiting on PostgreSQL PostGIS extension setup confirmation
```

---

## Code Review Standards

### Review Timeline

- **Target:** All PRs reviewed within 24 hours
- **Priority PRs:** Critical bugs and blockers reviewed within 4 hours
- **Approval Required:** Minimum 1 team member approval before merge

### Code Review Checklist

#### Functionality

- [ ] Code works as intended and meets acceptance criteria
- [ ] No console errors or warnings
- [ ] Edge cases handled appropriately
- [ ] Error messages are user-friendly

#### Code Quality

- [ ] Code follows project style guide and conventions
- [ ] Functions are concise and single-purpose
- [ ] Variable and function names are descriptive
- [ ] No commented-out code or debug statements
- [ ] No hardcoded values (use constants/config)

#### Security

- [ ] Input validation implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection measures in place
- [ ] Authentication/authorization properly enforced
- [ ] Sensitive data not logged or exposed

#### Testing

- [ ] Unit tests added for new functionality
- [ ] Integration tests updated if needed
- [ ] All tests passing before merge
- [ ] Code coverage maintained or improved

#### Documentation

- [ ] Code comments for complex logic
- [ ] API documentation updated (if applicable)
- [ ] README updated (if new dependencies added)

### Providing Feedback

**Be Constructive:**

- ✅ "Consider extracting this into a separate utility function for reusability."
- ❌ "This code is messy."

**Be Specific:**

- ✅ "The validation on line 45 should check for negative values."
- ❌ "Validation is wrong."

**Ask Questions:**

- ✅ "Why did you choose this approach over using async/await?"
- ❌ "This doesn't make sense."

---

## Blocker Resolution Process

### Identifying Blockers

A blocker is any issue that:

- Prevents progress on assigned tasks
- Requires external resources or permissions
- Depends on another team member's work
- Involves technical decisions beyond your scope

### Blocker Resolution Steps

1. **Document the Blocker**
   - Clearly describe the issue
   - Explain what you've tried
   - Specify what you need to proceed

2. **Communicate Immediately**
   - Post in team chat
   - Tag relevant team members
   - Escalate to team lead if urgent

3. **Find Workarounds**
   - Continue with non-blocked tasks
   - Create mock data or stubs if needed
   - Document assumptions for later

4. **Follow Up**
   - Set expected resolution timeline
   - Update team when blocker is resolved
   - Document solution for future reference

### Common Blockers and Solutions

| Blocker                          | Solution                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------- |
| **Missing API Keys**             | Use development/sandbox keys temporarily; Request production keys from admin |
| **Database Access**              | Use local PostgreSQL instance with test data; Request cloud DB access        |
| **Dependency on Another's Work** | Create interface/mock; Coordinate handoff timing                             |
| **Technical Decision Needed**    | Schedule quick team discussion; Implement both options if simple             |
| **Environment Setup**            | Pair programming session; Document setup steps for team                      |

---

## Integration Coordination

### Frontend-Backend Integration

#### API Contract Agreement

1. Backend team creates API documentation (OpenAPI/Swagger)
2. Frontend team reviews and provides feedback
3. Both teams agree on contracts before implementation
4. Use mock data during parallel development

#### Integration Testing Points

**Week 4 Integration Milestones:**

- [ ] Day 2: Auth endpoints integrated with login/register screens
- [ ] Day 3: POST /api/reports endpoint tested with submit form
- [ ] Day 4: GET /api/reports integrated with report list screen
- [ ] Day 5: File upload endpoint tested with image picker
- [ ] Day 5: End-to-end report submission flow working

#### Communication

- **Daily sync:** Quick check-in on integration status
- **Shared Postman collection:** Keep API requests up-to-date
- **Integration branch:** Dedicated branch for testing integration
- **Error logging:** Share logs when integration issues occur

---

## Sprint Progress Tracking

### Task Board Columns

1. **Backlog** - Planned but not started
2. **In Progress** - Actively being worked on
3. **Code Review** - PR open and awaiting review
4. **Testing** - Merged but undergoing QA
5. **Done** - Completed and tested

### Daily Progress Updates

Update task status daily:

- Move cards across board
- Add comments on progress/blockers
- Estimate remaining effort
- Link PRs to tasks

### Sprint Burndown

Track daily:

- Total story points/hours remaining
- Completed vs. planned velocity
- Identify if sprint is on track
- Adjust scope if needed

---

## Communication Channels

### Synchronous Communication

**When to Use:**

- Quick questions (< 5 min discussion)
- Pair programming sessions
- Blocker resolution
- Design decisions requiring consensus

**Tools:**

- Video call (Zoom/Google Meet)
- Voice chat (Discord/Slack)
- Screen sharing for debugging

### Asynchronous Communication

**When to Use:**

- Status updates
- Code reviews
- Documentation sharing
- Non-urgent questions

**Tools:**

- Slack/Discord channels
- GitHub comments and PRs
- Email for formal communication
- Project board comments

### Channel Organization

- `#general` - General team discussion
- `#week4-sprint` - Sprint-specific coordination
- `#frontend` - Frontend development questions
- `#backend` - Backend development questions
- `#blockers` - Immediate help needed
- `#code-reviews` - PR review requests

---

## Meeting Schedule

### Weekly Sprint Planning (Monday 10:00 AM)

- Review sprint goals
- Assign tasks to team members
- Estimate effort for each task
- Identify dependencies and risks

### Daily Standups (Daily 9:00 AM)

- 15-minute check-in
- Share progress and blockers
- Coordinate day's work

### Mid-Sprint Sync (Wednesday 2:00 PM)

- Review progress against goals
- Adjust scope if needed
- Address any integration issues

### Sprint Retrospective (Friday 4:00 PM)

- What went well
- What could be improved
- Action items for next sprint

### Ad-Hoc Pair Programming

- As needed for complex features
- Scheduled mutually by team members

---

## Quality Assurance

### Testing Strategy

#### Unit Testing

- Every new function/component
- Target: 80% code coverage
- Run before committing code

#### Integration Testing

- API endpoint testing (Supertest)
- Frontend-backend integration
- Run before merging PRs

#### Manual Testing

- Test on actual devices (iOS/Android)
- Test all user flows end-to-end
- Document test cases and results

### Definition of Done

A task is "done" when:

- [ ] Code is written and committed
- [ ] Unit tests added and passing
- [ ] Integration tests passing (if applicable)
- [ ] Code reviewed and approved
- [ ] Merged to main/development branch
- [ ] Manually tested on device
- [ ] Documentation updated
- [ ] Acceptance criteria met

---

## Risk Management

### Identified Risks for Week 4

| Risk                    | Probability | Impact | Mitigation                                       |
| ----------------------- | ----------- | ------ | ------------------------------------------------ |
| API keys not available  | Medium      | High   | Use sandbox keys; escalate early                 |
| File upload complexity  | Low         | Medium | Start early; research libraries                  |
| Map integration issues  | Medium      | Medium | Use official documentation; seek community help  |
| Testing framework setup | Low         | Low    | Follow established guides; pair program if stuck |
| Scope too large         | High        | High   | Prioritize core features; defer nice-to-haves    |

### Risk Mitigation Actions

1. **Obtain API Keys Early**
   - Google Maps API (iOS and Android)
   - Any cloud storage credentials needed
   - Database access credentials

2. **Technical Spike Sessions**
   - Research unfamiliar technologies
   - Prototype critical features
   - Document findings

3. **Continuous Integration**
   - Set up CI/CD pipeline early
   - Automate testing
   - Catch issues quickly

4. **Scope Management**
   - Focus on MVP first
   - Defer non-critical features
   - Re-prioritize based on velocity

---

## Best Practices

### Version Control

- **Commit frequency:** Commit small, logical changes frequently
- **Commit messages:** Use clear, descriptive messages
  - Format: `type(scope): description`
  - Example: `feat(reports): add POST endpoint with validation`
- **Branch naming:** `feature/issue-number-short-description`
  - Example: `feature/25-post-reports-endpoint`
- **No direct commits to main:** Always use PRs

### Code Organization

- **File structure:** Follow established project structure
- **Naming conventions:** Consistent naming (camelCase for JS, PascalCase for components)
- **Import order:** Dependencies → Internal modules → Components → Styles
- **Code formatting:** Use Prettier/ESLint (auto-format on save)

### Documentation

- **Code comments:** Explain "why" not "what"
- **API documentation:** Keep API-REFERENCE.md up-to-date
- **README updates:** Document new dependencies and setup steps
- **PR descriptions:** Explain changes, include screenshots if UI changes

---

## Week 4 Success Criteria

### Must-Have (P0)

- ✅ Complete API documentation
- ✅ File validation rules documented
- ✅ Map clustering algorithm defined
- 🔄 POST /api/reports endpoint functional
- 🔄 GET /api/reports with basic filtering
- 🔄 Report submission form screen working
- 🔄 Image picker integrated
- 🔄 File upload to backend working
- 🔄 Basic testing framework set up

### Should-Have (P1)

- 🔄 React Native Maps integrated
- 🔄 Geospatial queries implemented
- 🔄 Media preview component
- 🔄 Image compression service

### Nice-to-Have (P2)

- Advanced filtering (geographic bounds)
- Map marker clustering (implementation)
- Comprehensive integration tests
- Performance optimizations

---

## Team Roster and Responsibilities

### Kendahl Bingham (Team Lead)

**Responsibilities:**

- Overall sprint coordination
- Backend API development
- Database schema and queries
- Code reviews
- Blocker resolution

**Week 4 Tasks:**

- Report submission API endpoints
- File upload middleware
- Geospatial queries
- Testing framework setup

---

## Resources

### Documentation

- [API Reference](./API-REFERENCE.md)
- [API Reports Documentation](./API-REPORTS.md)
- [File Validation Guidelines](./FILE-VALIDATION.md)
- [Map Clustering Algorithm](./MAP-CLUSTERING.md)
- [Development Guide](./DEVELOPMENT.md)

### External Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

---

## Sprint Closure

### End of Sprint Checklist

- [ ] All P0 tasks completed
- [ ] All PRs reviewed and merged
- [ ] Documentation updated
- [ ] Demo prepared for stakeholders
- [ ] Sprint retrospective completed
- [ ] Week 4 end-of-sprint submission prepared
- [ ] Next sprint (Week 5) planned

### Sprint Demo

**Date:** Friday, March 24, 2026 @ 3:00 PM  
**Duration:** 30 minutes  
**Attendees:** Full team + stakeholders

**Demo Agenda:**

1. Report submission flow (frontend + backend)
2. Image upload and preview
3. Map integration progress
4. Code quality metrics (test coverage, etc.)
5. Q&A

---

**Document Maintained By:** Kendahl Bingham  
**Last Updated:** March 20, 2026  
**Sprint End Date:** March 24, 2026
