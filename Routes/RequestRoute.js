const express = require("express");
const Router = express.Router();

const RequestController = require('../Controllers/request.controller');
const AuthMiddleware = require('../app/Middlewares/Auth');
const RequestValidation = require('../app/Validators/RequestValidator');
const validate = require('../app/Middlewares/validate');

// Request routes
Router.get("/requests/:id", AuthMiddleware.checkAuth, RequestController.show);
//
Router.post("/requests",
    AuthMiddleware.checkAuth,
    RequestValidation.createRequest,
    validate,
    RequestController.create
);
Router.put("/requests/:id",
    AuthMiddleware.checkAuth,
    RequestController.update
);
Router.delete("/requests/:id", AuthMiddleware.checkAuth, RequestController.delete);

module.exports = Router;