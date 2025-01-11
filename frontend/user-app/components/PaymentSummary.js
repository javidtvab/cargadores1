// Import required modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaymentSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await axios.get('/api/payments/summary');
        setSummary(response.data);
      } catch (err) {
        setError('Failed to load payment summary.');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const handleConfirmPayment = async () => {
    try {
      await axios.post('/api/payments/complete', { paymentIntentId: summary.paymentIntentId });
      navigate('/');
    } catch (err) {
      setError('Failed to complete the payment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Payment Summary</h2>
      {summary && (
        <div>
          <p><strong>Charger:</strong> {summary.chargerName}</p>
          <p><strong>Location:</strong> {summary.chargerLocation}</p>
          <p><strong>kW Used:</strong> {summary.kWUsed}</p>
          <p><strong>Amount:</strong> ${summary.amount}</p>
          <button onClick={handleConfirmPayment}>Confirm Payment</button>
        </div>
      )}
    </div>
  );
}

export default PaymentSummary;
