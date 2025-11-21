const { body } = require('express-validator');
const db = require('../../db/models');

const createImage = [
    body('storeId')
        .notEmpty().withMessage('storeId is required')
        .isInt().withMessage('storeId must be an integer')
        .custom(async (storeId) => {
            const store = await db.Store.findByPk(storeId);
            if (!store) throw new Error('Store does not exist');
        }),
    body('isAllowed')
        .optional()
        .isBoolean()
        .withMessage('isAllowed must be true or false'),
];

module.exports = { createImage };
