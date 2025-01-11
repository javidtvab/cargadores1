// Import required modules
const request = require('supertest');
const { expect } = require('chai');
const app = require('../server/app');

describe('API Tests', () => {
  describe('User Routes', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ username: 'testuser', password: 'password123', email: 'testuser@example.com' });

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
    });

    it('should retrieve all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });

    it('should return a single user by ID', async () => {
      const userId = 'valid-user-id';
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id', userId);
    });
  });

  describe('Charger Routes', () => {
    it('should create a new charger', async () => {
      const response = await request(app)
        .post('/api/admin/chargers')
        .send({ name: 'Charger 1', location: 'Location A', capacity: 2 });

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
    });

    it('should retrieve all chargers', async () => {
      const response = await request(app).get('/api/chargers');
      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('Payment Routes', () => {
    it('should initiate a payment', async () => {
      const response = await request(app)
        .post('/api/payments/initiate')
        .send({ amount: 1000, currency: 'usd', description: 'Charging session' });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body).to.have.property('clientSecret');
    });

    it('should complete a payment', async () => {
      const paymentIntentId = 'valid-intent-id';
      const response = await request(app)
        .post('/api/payments/complete')
        .send({ paymentIntentId });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.equal('Payment completed successfully');
    });
  });
});
