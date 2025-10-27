const { body } = require('express-validator');
const db = require('../../db/models');

const createPayment = [
    body('userId')
        .notEmpty().withMessage('userId is required')
        .isInt().withMessage('userId must be an integer')
        .custom(async (userId) => {
            const user = await db.User.findByPk(userId);
            if (!user) throw new Error('User does not exist');
        }),
    body('price')
        .notEmpty().withMessage('price is required')
        .isFloat({ gt: 0 }).withMessage('price must be a positive number'),
    body('method').optional().isIn(['cash', 'card', 'transfer', 'other']).withMessage('Invalid payment method'),
    body('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Invalid status'),
];

const updatePayment = [
    body("price")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number"),

    body("method")
        .optional()
        .isIn(["cash", "card", "transfer", "other"])
        .withMessage("Invalid payment method"),

    body("status")
        .optional()
        .isIn(["pending", "completed", "failed"])
        .withMessage("Invalid payment status"),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("startDate must be a valid date"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("endDate must be a valid date"),
];


module.exports = { createPayment  , updatePayment};
