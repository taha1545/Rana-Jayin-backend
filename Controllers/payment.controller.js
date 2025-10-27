"use strict";

const db = require("../db/models");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");
const PaymentResource = require("../app/Resource/PaymentResource");
const dayjs = require("dayjs");

// 
exports.getAll = async (req, res) => {
    //
    const { page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;
    //
    const whereClause = {};
    if (userId) whereClause.userId = userId;
    //
    const { count, rows } = await db.Payment.findAndCountAll({
        where: whereClause,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "phone"],
                include: [
                    {
                        model: db.Store,
                        as: "stores",
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
    });
    //
    res.status(200).json({
        success: true,
        message: "Payments retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            payments: rows.map(PaymentResource),
        },
    });
};

// 
exports.show = async (req, res) => {
    const { id } = req.params;

    const payment = await db.Payment.findByPk(id, {
        include: [
            {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "phone"],
                include: [
                    {
                        model: db.Store,
                        as: "stores",
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
    });

    if (!payment) throw new NotFoundError("Payment not found");

    res.status(200).json({
        success: true,
        message: "Payment details loaded successfully",
        data: PaymentResource(payment),
    });
};

// 
exports.create = async (req, res) => {
    const { userId, price, method, status, startDate, endDate } = req.body;

    if (!userId || !price)
        throw new AppError("userId and price are required", 400);

    const user = await db.User.findByPk(userId);
    if (!user) throw new NotFoundError("User not found");
    //
    const start = startDate && startDate.trim() !== "" ? dayjs(startDate) : dayjs();
    const end = endDate && endDate.trim() !== "" ? dayjs(endDate) : start.add(1, "month");

    const payment = await db.Payment.create({
        userId,
        price,
        method: method || "cash",
        status: status || "completed",
        startDate: start || null,
        endDate: end || null,
    });

    res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: PaymentResource(payment),
    });
};

// 
exports.update = async (req, res) => {
    const { id } = req.params;
    // 
    const payment = await db.Payment.findByPk(id);
    if (!payment) throw new NotFoundError("Payment not found");
    //
    const { price, status, method, startDate, endDate } = req.body;
    // 
    await payment.update({
        price: price ?? payment.price,
        status: status ?? payment.status,
        method: method ?? payment.method,
        startDate: startDate ?? payment.startDate,
        endDate: endDate ?? payment.endDate,
    });
    //
    res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        data: PaymentResource(payment),
    });
};

// 
exports.delete = async (req, res) => {
    const { id } = req.params;
    const payment = await db.Payment.findByPk(id);
    if (!payment) throw new NotFoundError("Payment not found");

    await payment.destroy();

    res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
        data: { id },
    });
};
