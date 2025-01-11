// Import Stripe module
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initiate a payment
async function initiatePayment(req, res) {
  try {
    const { amount, currency, description } = req.body;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
}

// Complete a payment
async function completePayment(req, res) {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent to confirm status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({ success: true, message: 'Payment completed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to complete payment' });
  }
}

// Handle Stripe webhook events
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful:', event.data.object);
      break;
    case 'payment_intent.payment_failed':
      console.error('PaymentIntent failed:', event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

module.exports = {
  initiatePayment,
  completePayment,
  handleWebhook,
};
