const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registrar usuario
const registerUser = async (username, password) => {
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo usuario
  const newUser = await User.create({ username, password: hashedPassword });
  return newUser;
};

// Iniciar sesión
const loginUser = async (username, password) => {
  // Verificar si el usuario existe
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Comparar la contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Crear y firmar un token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
