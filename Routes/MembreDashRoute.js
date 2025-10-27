const express = require("express");
const Router = express.Router();

const MembreController = require('../Controllers/membre.controller');
const AuthMiddleware = require('../app/Middlewares/Auth');

// Member dashboard routes
Router.put("/stores/:storeId/toggle-active", AuthMiddleware.checkAuth, MembreController.toggleActiveStatus);
Router.get("/stores/:storeId/last-request", AuthMiddleware.checkAuth, MembreController.lastClientRequest);
Router.get("/stores/:storeId/analytics", AuthMiddleware.checkAuth, MembreController.analytics);

module.exports = Router;
