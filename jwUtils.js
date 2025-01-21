const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (user) => {
  // Crear el payload del token con la información del usuario
  const payload = {
    id: user.id,
    username: user.username,
  };

  // Firmar el token con el secreto y configuraciones
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // El token expira en 1 hora
  });

  return token;
};

// Verificar un token JWT
const verifyToken = (token) => {
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    throw new Error('Token no válido');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
