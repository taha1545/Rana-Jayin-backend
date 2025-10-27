"use strict";

const db = require("../db/models");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");
const RequestResource = require("../app/Resource/RequestResource");
const dayjs = require("dayjs");

// 
exports.getAll = async (req, res) => {
    const { storeId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const store = await db.Store.findByPk(storeId);
    if (!store) throw new NotFoundError("Store not found");

    const whereClause = { storeId };
    if (status) whereClause.status = status;

    const { count, rows } = await db.Request.findAndCountAll({
        where: whereClause,
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [
            { model: db.User, as: "client", attributes: ["id", "name", "phone"] },
            { model: db.Store, as: "store" },
        ],
    });

    res.status(200).json({
        success: true,
        message: "Requests retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            requests: rows.map(RequestResource),
        },
    });
};

//
exports.show = async (req, res) => {
    const { id } = req.params;

    const request = await db.Request.findByPk(id, {
        include: [
            { model: db.User, as: "client", attributes: ["id", "name", "phone"] },
            {
                model: db.Store,
                as: "store",
                attributes: ["id", "name", "type", "latitude", "longitude"],
                include: [{ model: db.User, as: "owner", attributes: ["id", "name", "phone"] }],
            },
        ],
    });

    if (!request) throw new NotFoundError("Request not found");

    res.status(200).json({
        success: true,
        message: "Request details loaded successfully",
        data: RequestResource(request),
    });
};

// 
exports.create = async (req, res) => {
    const { clientId, storeId, serviceType, latitude, longitude } = req.body;

    const request = await db.Request.create({
        clientId,
        storeId,
        serviceType: serviceType || "general",
        status: "pending",
        latitude,
        longitude: longitude || null,
    });

    res.status(201).json({
        success: true,
        message: "Request created successfully",
        data: RequestResource(request),
    });
};

exports.update = async (req, res) => {
    const { id } = req.params;
    let { status, completedAt } = req.body; 

    const request = await db.Request.findByPk(id);
    if (!request) throw new NotFoundError("Request not found");

    if (status === "completed" && !completedAt) {
        completedAt = new Date(); 
    } else {
        completedAt = completedAt || request.completedAt;
    }

    await request.update({
        status: status || request.status,
        completedAt,
    });

    res.status(200).json({
        success: true,
        message: "Request updated successfully",
        data: RequestResource(request),
    });
};

// Delete a request
exports.delete = async (req, res) => {
    const { id } = req.params;

    const request = await db.Request.findByPk(id);
    if (!request) throw new NotFoundError("Request not found");

    await request.destroy();

    res.status(200).json({
        success: true,
        message: "Request deleted successfully",
        data: { id },
    });
};
