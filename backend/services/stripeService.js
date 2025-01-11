// Import Stripe module
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
async function createPaymentIntent(amount, currency, description) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

// Retrieve a payment intent
async function retrievePaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
}

// Confirm payment intent
async function confirmPaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw new Error('Failed to confirm payment intent');
  }
}

// Handle Stripe webhooks
async function handleWebhook(event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.error('PaymentIntent failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw new Error('Failed to handle webhook event');
  }
}

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
  confirmPaymentIntent,
  handleWebhook,
};
