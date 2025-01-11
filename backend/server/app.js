// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');

// Import configurations and routes
const dbConfig = require('../config/dbConfig');
const routes = require('./routes');
const { errorHandler } = require('./middlewares');

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Connect to PostgreSQL
const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Attach pool to request object for reuse in routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes setup
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
