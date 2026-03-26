const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const bcrypt = require('bcrypt');

describe('Authentication Integration Tests', () => {
  let testUserId;

  // Clean up database before tests
  beforeAll(async () => {
    // Delete test user if exists
    await db.query('DELETE FROM users WHERE email = $1', [global.testUser.email]);
  });

  // Clean up after tests
  afterAll(async () => {
    if (testUserId) {
      await db.query('DELETE FROM users WHERE id = $1', [testUserId]);
    }
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(global.testUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.user.email).toBe(global.testUser.email);

      testUserId = response.body.data.user.id;
    });

    it('should reject registration with duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(global.testUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject registration with invalid email', async () => {
      const invalidUser = {
        ...global.testUser,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject registration with weak password', async () => {
      const weakPasswordUser = {
        ...global.testUser,
        email: 'weak@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(weakPasswordUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteUser = {
        email: 'incomplete@example.com',
        password: 'Test@123'
        // Missing first_name and last_name
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(incompleteUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: global.testUser.email,
          password: global.testUser.password
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(global.testUser.email);
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: global.testUser.email,
          password: 'WrongPassword123!'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test@123'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: global.testUser.email
          // Missing password
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Authentication Middleware', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: global.testUser.email,
          password: global.testUser.password
        });

      authToken = response.body.data.tokens.accessToken;
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject access with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject access with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', authToken) // Missing 'Bearer' prefix
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
