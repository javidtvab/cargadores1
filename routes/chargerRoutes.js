const express = require('express');
const chargerController = require('../controllers/chargerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para agregar un nuevo cargador
router.post('/', authMiddleware, chargerController.addCharger);

// Ruta para obtener todos los cargadores
router.get('/', authMiddleware, chargerController.getChargers);

// Ruta para obtener un cargador por ID
router.get('/:id', authMiddleware, chargerController.getChargerById);

// Ruta para actualizar un cargador
router.put('/:id', authMiddleware, chargerController.updateCharger);

// Ruta para eliminar un cargador
router.delete('/:id', authMiddleware, chargerController.deleteCharger);

module.exports = router;
