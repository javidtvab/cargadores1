const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Ruta para el registro de usuarios
router.post('/register', authController.register);

// Ruta para el inicio de sesión de usuarios
router.post('/login', authController.login);

module.exports = router;
