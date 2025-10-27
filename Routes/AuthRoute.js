const express = require("express");
const Router = express.Router();
//
const AuthController = require('../Controllers/auth.controller');
const UserController = require('../Controllers/user.controller');
const Upload = require('../app/Services/Storage');
const AuthMiddleware = require('../app/Middlewares/Auth');
const UserValidation = require('../app/Validators/UserValidator');
const Validate = require('../app/Middlewares/validate');
//
Router.post("/signup-client", Upload.single("image"), UserValidation.signupValidationClient, Validate, AuthController.signupClient);
// 
Router.post("/signup-membre",
    Upload.fields([
        { name: "certificate", maxCount: 1 },
        { name: "storeImages", maxCount: 10 },
    ]), UserValidation.signupValidationMembre, Validate, AuthController.signupMembre);
// 
Router.post("/login", Upload.single(), UserValidation.loginValidation, Validate, AuthController.login);
// 
Router.put("/update-password", AuthMiddleware.checkAuth, UserValidation.updatePasswordValidation, Validate, AuthController.updatePassword);
//
// User Routes
Router.get("/users", AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, UserController.showAllPaginate);
Router.get("/users/me", AuthMiddleware.checkAuth, UserController.getMe);
Router.put("/users/me", AuthMiddleware.checkAuth, Upload.single("image"), UserController.updateMe);
Router.get("/users/:id", AuthMiddleware.checkAuth, UserController.getUser);
Router.delete("/users/:id", AuthMiddleware.checkAuth, UserController.deleteUser);

module.exports = Router;