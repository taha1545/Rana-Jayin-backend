const express = require("express");
const Router = express.Router();

const StoreController = require('../Controllers/store.controller');
const StoreImageController = require('../Controllers/storeImage.controller');
const ReviewController = require('../Controllers/review.controller');
const RequestController = require('../Controllers/request.controller');
const Upload = require('../app/Services/Storage');
const AuthMiddleware = require('../app/Middlewares/Auth');
const Validate = require('../app/Middlewares/validate');
const StoreValidation = require('../app/Validators/StoreValidator');
const ReviewValidation = require('../app/Validators/ReviewValidator');

// Store routes
Router.get("/stores", StoreController.getAllStores);
Router.get("/stores/:id", StoreController.getStore);
Router.post("/stores/member", StoreController.getStoresByMember);
Router.get("/services", StoreController.showService);
//
Router.put("/stores/:id",
    AuthMiddleware.checkAuth,
    StoreValidation.updateStore,
    Validate,
    StoreController.updateStore
);
Router.delete("/stores/:id", AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, StoreController.deleteStore);

// Store image routes
Router.post("/store-images",
    AuthMiddleware.checkAuth,
    Upload.single("image"),
    StoreImageController.add
);
Router.delete("/store-images/:id", AuthMiddleware.checkAuth, StoreImageController.delete);

// Review routes
Router.get("/reviews/store/:storeId", ReviewController.getAll);
Router.post("/reviews/store/:storeId",
    AuthMiddleware.checkAuth,
    ReviewValidation.createReview,
    Validate,
    ReviewController.create
);
Router.delete("/stores/:storeId/reviews/:id", AuthMiddleware.checkAuth, ReviewController.delete);

// Request routes for stores
Router.get("/stores/:storeId/requests", AuthMiddleware.checkAuth, RequestController.getAll);

module.exports = Router;
