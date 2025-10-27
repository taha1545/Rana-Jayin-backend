const express = require("express");
const Router = express.Router();

const PaymentController = require('../Controllers/payment.controller');
const AuthMiddleware = require('../app/Middlewares/Auth');
const Validate = require('../app/Middlewares/validate');
const PaymentValidation = require('../app/Validators/PaymentValidator');

// Payment routes
Router.get("/payments", AuthMiddleware.checkAuth, PaymentController.getAll);
Router.get("/payments/:id", AuthMiddleware.checkAuth, PaymentController.show);
//
Router.post("/payments",
    AuthMiddleware.checkAuth,
    PaymentValidation.createPayment,
    Validate,
    PaymentController.create
);
Router.put(
    "/payments/:id",
    AuthMiddleware.checkAuth,
    PaymentValidation.updatePayment,
    Validate,
    PaymentController.update
);
Router.delete("/payments/:id", AuthMiddleware.checkAuth, PaymentController.delete);

module.exports = Router;