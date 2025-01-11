// Import required modules
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Import authentication context
import { AuthProvider } from './context/AuthContext';

// Render the application
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
