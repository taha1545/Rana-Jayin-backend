"use strict";

const db = require("../db/models");
const AppError = require("../app/Error/AppError");
const NotFoundError = require("../app/Error/NotFoundError");
const RequestResource = require("../app/Resource/RequestResource");
const dayjs = require("dayjs");

exports.toggleActiveStatus = async (req, res) => {
    const { storeId } = req.params;
    const { isActive } = req.body;
    // 
    if (typeof isActive === "undefined") {
        throw new AppError("isActive parameter is required", 400);
    }
    const store = await db.Store.findByPk(storeId);
    if (!store) throw new NotFoundError("Store not found");
    // 
    const newStatus = isActive === true || isActive === "true";
    //
    await store.update({ isActive: newStatus });
    //
    res.status(200).json({
        success: true,
        message: `Store status changed to ${newStatus ? "active" : "inactive"}`,
        data: { id: store.id, isActive: newStatus },
    });
};


// 
exports.lastClientRequest = async (req, res) => {
    const { storeId } = req.params;

    const request = await db.Request.findOne({
        where: { storeId },
        include: [
            { model: db.User, as: "client", attributes: ["id", "name", "phone"] },
        ],
        order: [["createdAt", "DESC"]],
    });

    if (!request) throw new NotFoundError("No request found for this store");

    res.status(200).json({
        success: true,
        message: "Last client request retrieved successfully",
        data: {
            client: request.client,
            request: RequestResource(request),
        },
    });
};

// 
exports.analytics = async (req, res) => {
    const { storeId } = req.params;

    const store = await db.Store.findByPk(storeId);
    if (!store) throw new NotFoundError("Store not found");

    // Calculate average rating
    const reviews = await db.Review.findAll({ where: { storeId } });
    const totalRatings = reviews.length;
    const averageRating = totalRatings
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0;

    // Total completed services
    const completedServices = await db.Request.count({
        where: { storeId, status: "completed" },
    });

    // Subscription end date (example: 30 days from store.createdAt)
    const subscriptionEnds = dayjs(store.createdAt).add(30, "day").format("YYYY-MM-DD");

    res.status(200).json({
        success: true,
        message: "Membre analytics loaded successfully",
        data: {
            storeId: store.id,
            averageRating: parseFloat(averageRating),
            totalServicesCompleted: completedServices,
            subscriptionEnds,
        },
    });
};
