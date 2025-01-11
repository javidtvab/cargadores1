// Stripe configuration
module.exports = {
  secretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your_webhook_secret',
};
