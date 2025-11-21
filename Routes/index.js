const express = require("express");
const Router = express.Router();
//
const AdminController = require('../Controllers/admin.controller');
const morgan = require('morgan');
Router.use(morgan('combined'));

// Import all route files
const authRoutes = require('./AuthRoute');
const storeRoutes = require('./StoreRoute');
const contactRoutes = require('./ContactRoute');
const membreDashRoutes = require('./MembreDashRoute');
const paymentRoutes = require('./PaymentRoute');
const requestRoutes = require('./RequestRoute');
const reportRoutes = require('./ReportRoute');

// Register routes
Router.use('/', authRoutes);
Router.use('/', storeRoutes); // 
Router.use('/', contactRoutes); // 
Router.use('/membre', membreDashRoutes); // 
Router.use('/', paymentRoutes); // 
Router.use('/', requestRoutes);
Router.get('/admin/stats', AdminController.getAnalytics);
Router.use('/', reportRoutes);

module.exports = Router;