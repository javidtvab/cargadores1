const bcrypt = require('bcryptjs');

// Generar un hash a partir de una contraseña
const hashPassword = async (password) => {
  try {
    // Generar un salt con un factor de costo de 10
    const salt = await bcrypt.genSalt(10);
    // Generar el hash utilizando el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error al generar el hash de la contraseña:', error);
    throw new Error('Error al generar el hash de la contraseña');
  }
};

// Comparar una contraseña con su hash
const comparePassword = async (password, hashedPassword) => {
  try {
    // Comparar la contraseña con el hash
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar la contraseña:', error);
    throw new Error('Error al comparar la contraseña');
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
