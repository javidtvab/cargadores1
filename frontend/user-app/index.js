// Import required modules
import React, { useState } from 'react';
import axios from 'axios';

function StripeConfig() {
  const [stripeKeys, setStripeKeys] = useState({ secretKey: '', webhookSecret: '' });
  const [message, setMessage] = useState('');

  async function handleSaveConfig(e) {
    e.preventDefault();
    try {
      await axios.post('/api/admin/stripe-config', stripeKeys);
      setMessage('Stripe configuration saved successfully!');
    } catch (err) {
      setMessage('Failed to save Stripe configuration.');
    }
  }

  return (
    <div>
      <h2>Stripe Configuration</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSaveConfig}>
        <input
          type="text"
          placeholder="Stripe Secret Key"
          value={stripeKeys.secretKey}
          onChange={(e) => setStripeKeys({ ...stripeKeys, secretKey: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Stripe Webhook Secret"
          value={stripeKeys.webhookSecret}
          onChange={(e) => setStripeKeys({ ...stripeKeys, webhookSecret: e.target.value })}
          required
        />
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
}

export default StripeConfig;
