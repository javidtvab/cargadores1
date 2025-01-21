require('dotenv').config(); // Cargar variables de entorno desde un archivo .env

const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: 'mysql', // Dialecto de la base de datos (MySQL en este caso)
    logging: false, // Desactivar el registro de consultas SQL (puedes activarlo si lo necesitas)
    pool: {
      max: 5, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo en ms que el pool intentará obtener una conexión antes de lanzar un error
      idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

module.exports = { sequelize };
