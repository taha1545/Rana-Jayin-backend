"use strict";

const db = require("../db/models");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");
const ReviewResource = require("../app/Resource/ReviewResource");

// 
exports.getAll = async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    // 
    const store = await db.Store.findByPk(storeId);
    if (!store) throw new NotFoundError("Store not found");
    // 
    const { count, rows } = await db.Review.findAndCountAll({
        where: { storeId },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [{ model: db.User, as: "client", attributes: ["id", "name", "phone"] }],
    });
    //
    res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            reviews: rows.map(ReviewResource),
        },
    });
};

// 
exports.create = async (req, res, next) => {
    //
    const { clientId, storeId, rating, comment } = req.body;
    // 
    const review = await db.Review.create({
        clientId,
        storeId,
        rating,
        comment,
    });
    //
    res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: ReviewResource(review),
    });
};

//
exports.delete = async (req, res, next) => {
    //
    const { storeId, id } = req.params;
    //
    const store = await db.Store.findByPk(storeId);
    if (!store) throw new NotFoundError("Store not found");
    //
    const review = await db.Review.findOne({
        where: { id, storeId },
    });
    if (!review) throw new NotFoundError("Review not found for this store");
    //
    await review.destroy();
    //
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        data: { id },
    });
};
