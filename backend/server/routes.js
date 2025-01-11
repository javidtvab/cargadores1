// Import required modules
const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');
const chargerController = require('../controllers/chargerController');
const stripeController = require('../controllers/stripeController');

// Import middlewares
const { authenticate, adminAuthenticate } = require('./middlewares');

// Public routes (no authentication required)
router.get('/chargers', chargerController.getAllChargers);
router.post('/payments/initiate', stripeController.initiatePayment);
router.post('/payments/complete', stripeController.completePayment);

// Protected admin routes
router.use('/admin', adminAuthenticate); // Apply admin authentication to all admin routes

// Admin-specific routes
router.get('/admin/users', userController.getAllUsers);
router.post('/admin/tariffs', chargerController.createTariff);
router.put('/admin/tariffs/:id', chargerController.updateTariff);
router.delete('/admin/tariffs/:id', chargerController.deleteTariff);

// Export the router
module.exports = router;
