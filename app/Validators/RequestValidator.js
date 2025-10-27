const { body } = require('express-validator');
const db = require('../../db/models');

const createRequest = [
    body('clientId')
        .notEmpty().withMessage('clientId is required')
        .isInt().withMessage('clientId must be an integer')
        .custom(async (clientId) => {
            const user = await db.User.findByPk(clientId);
            if (!user) throw new Error('Client does not exist');
        }),
    body('storeId')
        .notEmpty().withMessage('storeId is required')
        .isInt().withMessage('storeId must be an integer')
        .custom(async (storeId) => {
            const store = await db.Store.findByPk(storeId);
            if (!store) throw new Error('Store does not exist');
        }),
    body('serviceType').notEmpty().withMessage('serviceType is required'),
    body('latitude').notEmpty().withMessage('latitude is required').isFloat().withMessage('latitude must be a float'),
    body('longitude').notEmpty().withMessage('longitude is required').isFloat().withMessage('longitude must be a float')
];

const updateRequest = [
    body('status').optional().isIn(['pending', 'accepted', 'completed', 'canceled']).withMessage('Invalid status'),
];

module.exports = { createRequest, updateRequest };
