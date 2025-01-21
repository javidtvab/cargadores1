// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Determinar el código de estado de la respuesta
  const statusCode = err.statusCode || 500;

  // Enviar la respuesta de error
  res.status(statusCode).json({
    message: err.message || 'Error en el servidor',
    // En entornos de desarrollo, podemos incluir el stack trace
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
