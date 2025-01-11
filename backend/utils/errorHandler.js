// Middleware for centralized error handling
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || 'Unknown error');
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
