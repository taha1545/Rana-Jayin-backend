const { body } = require('express-validator');
const db = require('../../db/models');

// Create Store
const createStore = [
    body('userId')
        .notEmpty().withMessage('User ID is required.')
        .isInt().withMessage('Invalid user ID.'),
    body('name')
        .notEmpty().withMessage('Please enter your store name.'),
    body('type')
        .notEmpty().withMessage('Please select your store type.'),
    body('car')
        .optional()
        .custom((value) => {
            if (typeof value !== 'object') {
                throw new Error('Car must be a JSON object');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString().withMessage('Please enter a valid description.'),
    body('latitude')
        .optional()
        .isFloat().withMessage('Please provide a valid latitude.'),
    body('longitude')
        .optional()
        .isFloat().withMessage('Please provide a valid longitude.'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('Store status must be true or false.'),
    body('priceRange')
        .optional()
        .isString().withMessage('Please enter your store price range.'),
];

// Update Store
const updateStore = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Store name cannot be empty.'),
    body('type')
        .optional(),
    body('car')
        .optional()
        .custom((value) => {
            if (typeof value !== 'object') {
                throw new Error('Car must be a JSON object');
            }
            return true;
        }),
    body('description')
        .optional()
        .isString()
        .withMessage('Please enter a valid description.'),
    body('latitude')
        .optional()
        .isFloat()
        .withMessage('Please provide a valid latitude.'),
    body('longitude')
        .optional()
        .isFloat()
        .withMessage('Please provide a valid longitude.'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Store status must be true or false.'),
    body('priceRange')
        .optional()
        .isString()
        .withMessage('Please enter a valid price range.'),
];

module.exports = { createStore, updateStore };
