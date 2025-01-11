// Validator functions for input data
const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
}

// Validators for user routes
const userValidators = {
  createUser: [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors,
  ],
  userIdParam: [
    param('id').isUUID().withMessage('Invalid user ID format'),
    handleValidationErrors,
  ],
};

// Validators for charger routes
const chargerValidators = {
  createCharger: [
    body('name').isString().notEmpty().withMessage('Charger name is required'),
    body('location').isString().notEmpty().withMessage('Charger location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    handleValidationErrors,
  ],
  chargerIdParam: [
    param('id').isUUID().withMessage('Invalid charger ID format'),
    handleValidationErrors,
  ],
};

// Validators for tariff routes
const tariffValidators = {
  createTariff: [
    body('name').isString().notEmpty().withMessage('Tariff name is required'),
    body('rate').isFloat({ gt: 0 }).withMessage('Rate must be a positive number'),
    body('timeSlotStart').optional().isISO8601().withMessage('Invalid time slot start format'),
    body('timeSlotEnd').optional().isISO8601().withMessage('Invalid time slot end format'),
    handleValidationErrors,
  ],
  tariffIdParam: [
    param('id').isUUID().withMessage('Invalid tariff ID format'),
    handleValidationErrors,
  ],
};

module.exports = {
  userValidators,
  chargerValidators,
  tariffValidators,
};
