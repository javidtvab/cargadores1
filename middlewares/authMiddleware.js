const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.header('Authorization')?.split(' ')[1];

  // Verificar si el token no está presente
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar el usuario decodificado al objeto de solicitud
    req.user = decoded;

    // Continuar al siguiente middleware o ruta
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token no válido.' });
  }
};

module.exports = authMiddleware;
