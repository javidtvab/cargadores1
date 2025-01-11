// Import required modules
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Render the application using createRoot
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
