// Middleware for error handling
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

// Middleware for authentication (example)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Example token verification logic
  const token = authHeader.split(' ')[1];
  if (token === 'valid_token_example') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden' });
  }
}

// Middleware for database connection
function attachDatabase(req, res, next) {
  if (!req.db) {
    return res.status(500).json({ success: false, message: 'Database connection not available' });
  }
  next();
}

module.exports = {
  errorHandler,
  authenticate,
  attachDatabase,
};
