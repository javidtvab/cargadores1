// Import required modules
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ChargerSelection from './pages/ChargerSelection';
import PaymentSummary from './pages/PaymentSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chargers" element={<ChargerSelection />} />
        <Route path="/payment-summary" element={<PaymentSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
