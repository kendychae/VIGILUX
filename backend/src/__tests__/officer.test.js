/**
 * Officer Dashboard API — Integration Tests
 * W6 Ticket #58 — Law Enforcement Dashboard: Backend API & Report Assignment
 *
 * Covers:
 *   GET  /api/v1/officer/reports        — paginated list with filters
 *   GET  /api/v1/officer/reports/queue  — unassigned priority queue
 *   PATCH /api/v1/officer/reports/:id/assign   — claim report
 *   PATCH /api/v1/officer/reports/:id/unassign — release assignment
 *
 * E2E Flow Tests
 * W6 Ticket #59 — E2E Testing Suite & OWASP Security Audit
 *
 * Covers:
 *   Citizen full flow: register → submit report → view report
 *   Officer full flow: login → claim report → update status
 *   IDOR: citizen cannot update another citizen's report
 *   Security: unauthenticated requests return 401
 */

const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const bcrypt = require('bcrypt');

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const makeReport = (overrides = {}) => ({
  title: 'Officer Test Report',
  description: 'A detailed description for officer dashboard testing purposes.',
  incident_type: 'theft',
  latitude: 34.0522,
  longitude: -118.2437,
  address: '100 Test Ave, Los Angeles, CA 90001',
  incident_date: new Date().toISOString(),
  priority: 'high',
  ...overrides,
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 1 — Officer Dashboard API (Ticket #58)
// ═════════════════════════════════════════════════════════════════════════════

describe('Officer Dashboard API: /api/v1/officer', () => {
  let citizenToken, officerToken, adminToken;
  let citizenId, officerId, adminId;
  let reportId;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Test@123', 12);

    const insertUser = (email, role, first) =>
      db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_verified, is_active)
         VALUES ($1,$2,$3,'OfficerTest',$4,true,true)
         ON CONFLICT (email) DO UPDATE SET password_hash=$2, user_type=$4
         RETURNING id`,
        [email, hash, first, role]
      );

    const c = await insertUser('odash-citizen@example.com', 'citizen', 'ODash');
    citizenId = c.rows[0].id;

    const o = await insertUser('odash-officer@example.com', 'officer', 'ODash');
    officerId = o.rows[0].id;

    const a = await insertUser('odash-admin@example.com', 'admin', 'ODash');
    adminId = a.rows[0].id;

    const login = (email) =>
      request(app).post('/api/v1/auth/login').send({ email, password: 'Test@123' });

    citizenToken = (await login('odash-citizen@example.com')).body.data?.tokens?.accessToken;
    officerToken = (await login('odash-officer@example.com')).body.data?.tokens?.accessToken;
    adminToken   = (await login('odash-admin@example.com')).body.data?.tokens?.accessToken;

    // Create one unassigned report for officer tests
    const rr = await db.query(
      `INSERT INTO reports (user_id, title, description, incident_type, status, priority, latitude, longitude, incident_date)
       VALUES ($1,'Officer Dashboard Test','A report to test officer claiming','vandalism','submitted','urgent',34.05,-118.24,NOW())
       RETURNING id`,
      [citizenId]
    );
    reportId = rr.rows[0].id;
  });

  afterAll(async () => {
    if (reportId)  await db.query('DELETE FROM reports WHERE id=$1', [reportId]);
    if (citizenId) await db.query('DELETE FROM users WHERE id=$1', [citizenId]);
    if (officerId) await db.query('DELETE FROM users WHERE id=$1', [officerId]);
    if (adminId)   await db.query('DELETE FROM users WHERE id=$1', [adminId]);
  });

  // ── GET /api/v1/officer/reports ──────────────────────────────────────────

  describe('GET /api/v1/officer/reports', () => {
    it('officer: 200 with paginated report list', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination).toHaveProperty('total_items');
    });

    it('officer: 200 filtered by status=submitted', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports?status=submitted')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data.every(r => r.status === 'submitted')).toBe(true);
      }
    });

    it('officer: 400 for invalid status filter', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports?status=garbage')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(400);
      expect(res.body.success).toBe(false);
    });

    it('citizen: 403 — cannot access officer report list', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);
      expect(res.body.success).toBe(false);
    });

    it('unauthenticated: 401', async () => {
      await request(app)
        .get('/api/v1/officer/reports')
        .expect(401);
    });
  });

  // ── GET /api/v1/officer/reports/queue ───────────────────────────────────

  describe('GET /api/v1/officer/reports/queue', () => {
    it('officer: 200 with unassigned reports sorted by priority', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports/queue')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // All returned reports must be unassigned
      expect(res.body.data.every(r => r.assigned_to === null || r.assigned_to === undefined)).toBe(true);
    });

    it('admin: 200 can view queue', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports/queue')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
    });

    it('citizen: 403 — cannot access report queue', async () => {
      await request(app)
        .get('/api/v1/officer/reports/queue')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);
    });
  });

  // ── PATCH /api/v1/officer/reports/:id/assign ────────────────────────────

  describe('PATCH /api/v1/officer/reports/:id/assign', () => {
    it('officer: 200 can claim a report', async () => {
      // Reset assignment first
      await db.query('UPDATE reports SET assigned_to=NULL, assigned_at=NULL WHERE id=$1', [reportId]);

      const res = await request(app)
        .patch(`/api/v1/officer/reports/${reportId}/assign`)
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.assigned_to).toBe(officerId);
    });

    it('officer: claimed report no longer in queue', async () => {
      const res = await request(app)
        .get('/api/v1/officer/reports/queue')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      const ids = res.body.data.map(r => r.id);
      expect(ids).not.toContain(reportId);
    });

    it('officer: 400 for invalid report UUID', async () => {
      const res = await request(app)
        .patch('/api/v1/officer/reports/not-a-uuid/assign')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(400);
      expect(res.body.success).toBe(false);
    });

    it('officer: 404 for non-existent report', async () => {
      const res = await request(app)
        .patch('/api/v1/officer/reports/00000000-0000-0000-0000-000000000000/assign')
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(404);
      expect(res.body.success).toBe(false);
    });

    it('citizen: 403 cannot assign a report', async () => {
      await request(app)
        .patch(`/api/v1/officer/reports/${reportId}/assign`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);
    });
  });

  // ── PATCH /api/v1/officer/reports/:id/unassign ──────────────────────────

  describe('PATCH /api/v1/officer/reports/:id/unassign', () => {
    it('officer: 200 can release their own assignment', async () => {
      // Ensure officer owns the assignment
      await db.query('UPDATE reports SET assigned_to=$1, assigned_at=NOW() WHERE id=$2', [officerId, reportId]);

      const res = await request(app)
        .patch(`/api/v1/officer/reports/${reportId}/unassign`)
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.assigned_to).toBeNull();
    });

    it('officer: 404 cannot release another officer's assignment', async () => {
      // Admin assigns to themselves, officer tries to unassign
      await db.query('UPDATE reports SET assigned_to=$1, assigned_at=NOW() WHERE id=$2', [adminId, reportId]);

      const res = await request(app)
        .patch(`/api/v1/officer/reports/${reportId}/unassign`)
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(404);
      expect(res.body.success).toBe(false);
    });

    it('admin: 200 can release any assignment', async () => {
      // Report is currently assigned to admin (from previous test)
      const res = await request(app)
        .patch(`/api/v1/officer/reports/${reportId}/unassign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 2 — E2E User Flow Tests (Ticket #59)
// ═════════════════════════════════════════════════════════════════════════════

describe('E2E: Citizen Report Submission Flow', () => {
  let citizenToken;
  let citizenId;
  let reportId;
  const email = 'e2e-citizen@example.com';

  beforeAll(async () => {
    // Clean slate
    await db.query('DELETE FROM users WHERE email=$1', [email]);
  });

  afterAll(async () => {
    if (reportId)  await db.query('DELETE FROM reports WHERE id=$1', [reportId]);
    if (citizenId) await db.query('DELETE FROM users WHERE id=$1', [citizenId]);
  });

  it('step 1 — citizen can register a new account', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'Test@123',
        firstName: 'E2E',
        lastName: 'Citizen',
        userType: 'citizen',
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    citizenId = res.body.data.user.id;
    citizenToken = res.body.data.tokens.accessToken;
  });

  it('step 2 — citizen can submit an incident report', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send(makeReport({ title: 'E2E Submission Test', priority: 'medium' }))
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('submitted');
    reportId = res.body.data.id;
  });

  it('step 3 — citizen can view their submitted report', async () => {
    const res = await request(app)
      .get(`/api/v1/reports/${reportId}`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(reportId);
    expect(res.body.data.title).toBe('E2E Submission Test');
    expect(res.body.data).toHaveProperty('media');
    expect(res.body.data).toHaveProperty('updates');
  });

  it('step 4 — citizen can view the status history of their report', async () => {
    const res = await request(app)
      .get(`/api/v1/reports/${reportId}/status-history`)
      .set('Authorization', `Bearer ${citizenToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('E2E: Officer Claim & Status Update Flow', () => {
  let officerToken, citizenToken;
  let officerId, citizenId;
  let reportId;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Test@123', 12);

    const c = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_verified, is_active)
       VALUES ('e2e-flow-citizen@example.com',$1,'E2E','FlowCitizen','citizen',true,true)
       ON CONFLICT (email) DO UPDATE SET password_hash=$1 RETURNING id`,
      [hash]
    );
    citizenId = c.rows[0].id;

    const o = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_verified, is_active)
       VALUES ('e2e-flow-officer@example.com',$1,'E2E','FlowOfficer','officer',true,true)
       ON CONFLICT (email) DO UPDATE SET password_hash=$1 RETURNING id`,
      [hash]
    );
    officerId = o.rows[0].id;

    const login = (email) =>
      request(app).post('/api/v1/auth/login').send({ email, password: 'Test@123' });

    citizenToken = (await login('e2e-flow-citizen@example.com')).body.data?.tokens?.accessToken;
    officerToken = (await login('e2e-flow-officer@example.com')).body.data?.tokens?.accessToken;

    // Citizen submits report
    const rr = await db.query(
      `INSERT INTO reports (user_id, title, description, incident_type, status, priority, latitude, longitude, incident_date)
       VALUES ($1,'E2E Officer Flow Report','Report for officer E2E test flow','assault','submitted','high',34.05,-118.24,NOW())
       RETURNING id`,
      [citizenId]
    );
    reportId = rr.rows[0].id;
  });

  afterAll(async () => {
    if (reportId)  await db.query('DELETE FROM reports WHERE id=$1', [reportId]);
    if (citizenId) await db.query('DELETE FROM users WHERE id=$1', [citizenId]);
    if (officerId) await db.query('DELETE FROM users WHERE id=$1', [officerId]);
  });

  it('step 1 — officer can view the unassigned queue', async () => {
    const res = await request(app)
      .get('/api/v1/officer/reports/queue')
      .set('Authorization', `Bearer ${officerToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    const ids = res.body.data.map(r => r.id);
    expect(ids).toContain(reportId);
  });

  it('step 2 — officer can claim the report', async () => {
    const res = await request(app)
      .patch(`/api/v1/officer/reports/${reportId}/assign`)
      .set('Authorization', `Bearer ${officerToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assigned_to).toBe(officerId);
  });

  it('step 3 — officer can transition status to under_review', async () => {
    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}/status`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ status: 'under_review', notes: 'Reviewing the submitted incident now.' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('under_review');
  });

  it('step 4 — officer can transition status to investigating', async () => {
    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}/status`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ status: 'investigating', notes: 'On-site investigation started.' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('investigating');
  });

  it('step 5 — report appears under officer My Cases filter', async () => {
    const res = await request(app)
      .get('/api/v1/officer/reports?assignedTo=me')
      .set('Authorization', `Bearer ${officerToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    const ids = res.body.data.map(r => r.id);
    expect(ids).toContain(reportId);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 3 — OWASP: Security Checks (Ticket #59)
// ═════════════════════════════════════════════════════════════════════════════

describe('OWASP: Security Controls', () => {
  let tokenA, tokenB;
  let userAId, userBId;
  let reportByA;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Test@123', 12);

    const a = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_verified, is_active)
       VALUES ('owasp-a@example.com',$1,'OWASP','UserA','citizen',true,true)
       ON CONFLICT (email) DO UPDATE SET password_hash=$1 RETURNING id`,
      [hash]
    );
    userAId = a.rows[0].id;

    const b = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_verified, is_active)
       VALUES ('owasp-b@example.com',$1,'OWASP','UserB','citizen',true,true)
       ON CONFLICT (email) DO UPDATE SET password_hash=$1 RETURNING id`,
      [hash]
    );
    userBId = b.rows[0].id;

    const login = (email) =>
      request(app).post('/api/v1/auth/login').send({ email, password: 'Test@123' });

    tokenA = (await login('owasp-a@example.com')).body.data?.tokens?.accessToken;
    tokenB = (await login('owasp-b@example.com')).body.data?.tokens?.accessToken;

    // User A creates a report
    const rr = await db.query(
      `INSERT INTO reports (user_id, title, description, incident_type, status, priority, latitude, longitude, incident_date)
       VALUES ($1,'OWASP Test Report','Testing IDOR protection','noise_complaint','submitted','low',34.05,-118.24,NOW())
       RETURNING id`,
      [userAId]
    );
    reportByA = rr.rows[0].id;
  });

  afterAll(async () => {
    if (reportByA) await db.query('DELETE FROM reports WHERE id=$1', [reportByA]);
    if (userAId)   await db.query('DELETE FROM users WHERE id=$1', [userAId]);
    if (userBId)   await db.query('DELETE FROM users WHERE id=$1', [userBId]);
  });

  it('IDOR: user B cannot update user A\'s report', async () => {
    const res = await request(app)
      .patch(`/api/v1/reports/${reportByA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'IDOR Attack Title' })
      .expect(403);
    expect(res.body.success).toBe(false);
  });

  it('IDOR: user B cannot delete user A\'s report', async () => {
    const res = await request(app)
      .delete(`/api/v1/reports/${reportByA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(403);
    expect(res.body.success).toBe(false);
  });

  it('broken auth: request with no token returns 401', async () => {
    await request(app).get('/api/v1/reports').expect(401);
    await request(app).post('/api/v1/reports').expect(401);
  });

  it('broken auth: request with tampered token returns 401', async () => {
    const tamperedToken = tokenA.slice(0, -10) + 'BADPADDING';
    const res = await request(app)
      .get('/api/v1/reports')
      .set('Authorization', `Bearer ${tamperedToken}`)
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('security headers: helmet adds X-Content-Type-Options header', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('security headers: helmet adds X-Frame-Options header', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});
