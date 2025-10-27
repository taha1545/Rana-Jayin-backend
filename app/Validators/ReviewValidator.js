const { body } = require('express-validator');
const db = require('../../db/models');

const createReview = [
    body('storeId')
        .notEmpty().withMessage('storeId is required')
        .isInt().withMessage('storeId must be an integer')
        .custom(async (storeId) => {
            const store = await db.Store.findByPk(storeId);
            if (!store) throw new Error('Store does not exist');
        }),
    body('clientId')
        .notEmpty().withMessage('clientId is required')
        .isInt().withMessage('clientId must be an integer')
        .custom(async (clientId) => {
            const user = await db.User.findByPk(clientId);
            if (!user) throw new Error('Client does not exist');
        }),
    body('rating')
        .notEmpty().withMessage('rating is required')
        .isFloat({ min: 0, max: 5 }).withMessage('rating must be between 0 and 5'),
    body('comment').optional().isString(),
];

module.exports = { createReview };
