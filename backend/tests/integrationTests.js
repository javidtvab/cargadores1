// Import required modules
const request = require('supertest');
const { expect } = require('chai');
const app = require('../server/app');

describe('Integration Tests', () => {
  it('should create a user, initiate a payment, and complete a charging session', async () => {
    // Step 1: Create a new user
    const userResponse = await request(app)
      .post('/api/users')
      .send({ username: 'integrationUser', password: 'securePassword', email: 'integration@example.com' });

    expect(userResponse.status).to.equal(201);
    const userId = userResponse.body.data.id;

    // Step 2: Create a new charger
    const chargerResponse = await request(app)
      .post('/api/admin/chargers')
      .send({ name: 'Integration Charger', location: 'Test Location', capacity: 2 });

    expect(chargerResponse.status).to.equal(201);
    const chargerId = chargerResponse.body.data.id;

    // Step 3: Start a charging session
    const startSessionResponse = await request(app)
      .post(`/api/chargers/${chargerId}/start`)
      .send({ userId, connector: 'A' });

    expect(startSessionResponse.status).to.equal(200);
    const sessionId = startSessionResponse.body.data.sessionId;

    // Step 4: Initiate a payment
    const paymentResponse = await request(app)
      .post('/api/payments/initiate')
      .send({ amount: 1000, currency: 'usd', description: 'Charging session' });

    expect(paymentResponse.status).to.equal(200);
    const clientSecret = paymentResponse.body.clientSecret;

    // Step 5: Complete the charging session
    const stopSessionResponse = await request(app)
      .post(`/api/chargers/${chargerId}/stop`)
      .send({ sessionId });

    expect(stopSessionResponse.status).to.equal(200);

    // Step 6: Complete the payment
    const completePaymentResponse = await request(app)
      .post('/api/payments/complete')
      .send({ paymentIntentId: clientSecret });

    expect(completePaymentResponse.status).to.equal(200);
    expect(completePaymentResponse.body.success).to.be.true;
    expect(completePaymentResponse.body.message).to.equal('Payment completed successfully');
  });
});
