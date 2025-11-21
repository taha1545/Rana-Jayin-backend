const express = require("express");
const Router = express.Router();
//
const ReportController = require('../Controllers/report.controller');
const Upload = require('../app/Services/Storage');
const AuthMiddleware = require('../app/Middlewares/Auth');
//
Router.post("/report", Upload.single("image"), ReportController.createReport);
Router.get("/reports", AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, ReportController.getAllReports);
//
module.exports = Router;