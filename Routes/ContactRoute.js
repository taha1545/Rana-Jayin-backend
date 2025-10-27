const express = require("express");
const Router = express.Router();

const ContactController = require('../Controllers/contact.controller');
const AuthMiddleware = require('../app/Middlewares/Auth');

// Contact routes
Router.get("/contacts", AuthMiddleware.checkAuth, ContactController.getAllContacts);
Router.post("/contacts", ContactController.createContact);
Router.delete("/contacts/:id", AuthMiddleware.checkAuth, ContactController.deleteContact);

module.exports = Router;
