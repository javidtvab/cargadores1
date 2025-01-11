// Import required modules
const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');
const chargerController = require('../controllers/chargerController');
const stripeController = require('../controllers/stripeController');

// Define routes
// User routes
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Charger routes
router.get('/chargers', chargerController.getAllChargers);
router.post('/chargers', chargerController.createCharger);
router.get('/chargers/:id', chargerController.getChargerById);
router.put('/chargers/:id', chargerController.updateCharger);
router.delete('/chargers/:id', chargerController.deleteCharger);

// Stripe routes
router.post('/payments/initiate', stripeController.initiatePayment);
router.post('/payments/complete', stripeController.completePayment);

// Export the router
module.exports = router;
