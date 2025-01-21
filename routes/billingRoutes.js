const express = require('express');
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear una nueva factura
router.post('/', authMiddleware, billingController.createInvoice);

// Ruta para obtener todas las facturas de un usuario
router.get('/user/:userId', authMiddleware, billingController.getUserInvoices);

// Ruta para obtener una factura por ID
router.get('/:id', authMiddleware, billingController.getInvoiceById);

module.exports = router;
