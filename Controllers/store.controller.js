"use strict";

const db = require("../db/models");
const StoreResource = require("../app/Resource/StoreResource");
const NotFoundError = require("../app/Error/NotFoundError");
const AppError = require("../app/Error/AppError");
// 
const getDistance = require("../app/Services/CalculeDistance").getDistance;
const calculateAverageRating = require("../app/Services/calculateAverageRating").calculateAverageRating;
const AllTypeServices = [
    "onSiteRepair",
    "towingService",
    "batteryBoost",
    "emergencySupport",
    "fuelDelivery",
    "safetyCheck",
    "accidentAssistance",
    "quickResponse",
];
// 
exports.getAllStores = async (req, res) => {
    //
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    //
    const { count, rows } = await db.Store.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [
            { model: db.User, as: "owner", attributes: ["id", "name", "phone"] },
            { model: db.Review, as: "reviews", attributes: ["rating"] },
        ],
    });
    //
    const formattedStores = rows.map((store) => {
        const storeJSON = store.toJSON();
        const avgRating = calculateAverageRating(storeJSON.reviews);
        return {
            ...StoreResource(store),
            member: store.owner
                ? { id: store.owner.id, name: store.owner.name, phone: store.owner.phone }
                : null,
            averageRating: avgRating,
        };
    });
    //
    res.status(200).json({
        success: true,
        message: "Stores retrieved successfully",
        data: {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            stores: formattedStores,
        },
    });
};

exports.getStore = async (req, res) => {
    const { id } = req.params;

    const store = await db.Store.findByPk(id, {
        include: [
            {
                model: db.User,
                as: "owner",
                attributes: ["id", "name", "phone"],
                include: [
                    { model: db.Payment, as: "payments" },
                ],
            },
            { model: db.StoreImage, as: "images", attributes: ["id", "imageUrl"] },
            {
                model: db.Review,
                as: "reviews",
                attributes: ["id", "rating", "comment", "createdAt"],
                include: [
                    { model: db.User, as: "client", attributes: ["id", "name"] },
                ],
            },
            { model: db.Request, as: "requests", attributes: ["id"] },
        ],
    });

    if (!store) throw new NotFoundError("Store not found");

    const storeJSON = store.toJSON();
    const avgRating = calculateAverageRating(storeJSON.reviews);

    res.status(200).json({
        success: true,
        message: "Store details loaded successfully",
        data: {
            ...StoreResource(store),
            member: store.owner
                ? { id: store.owner.id, name: store.owner.name, phone: store.owner.phone }
                : null,
            averageRating: avgRating,
            images: store.images || [],
            reviews: store.reviews || [],
            requestCount: store.requests ? store.requests.length : 0,
            payments: store.owner?.payments || [],
        },
    });
};

exports.updateStore = async (req, res) => {
    //
    const { id } = req.params;
    const store = await db.Store.findByPk(id);
    //
    if (!store) throw new NotFoundError("Store not found");
    //
    const {
        name,
        type,
        description,
        latitude,
        longitude,
        priceRange,
        isActive,
    } = req.body;
    //
    if (req.file) store.certificate = req.file.path;
    //
    await store.update({
        name,
        type,
        description,
        latitude,
        longitude,
        priceRange,
        isActive,
    });
    //
    res.status(200).json({
        success: true,
        message: "Store updated successfully",
        data: StoreResource(store),
    });
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    const store = await db.Store.findByPk(id);
    //
    if (!store) throw new NotFoundError("Store not found");
    //
    await store.destroy();
    //
    res.status(200).json({
        success: true,
        message: "Store deleted successfully",
    });
};

exports.showService = async (req, res) => {
    const { latitude, longitude } = req.query;
    //
    if (!latitude || !longitude)
        throw new AppError("Latitude and longitude are required", 400);
    //
    const allStores = await db.Store.findAll({
        where: { isActive: true },
      include: [
            {
                model: db.User,
                as: "owner",
            },
            { model: db.StoreImage, as: "images", attributes: ["id", "imageUrl"] },
            {
                model: db.Review,
                as: "reviews",
                attributes: ["id", "rating", "comment", "createdAt"],
                include: [
                    { model: db.User, as: "client", attributes: ["id", "name"] },
                ],
            },
            { model: db.Request, as: "requests", attributes: ["id"] },
        ],
    });
    //
    if (!allStores || allStores.length === 0)
        throw new NotFoundError("No active stores found");
    //
    const nearestStores = [];
    //
    for (const serviceType of AllTypeServices) {
        // Filter stores by this specific service type
        const serviceStores = allStores.filter(
            (store) => store.type === serviceType
        );
        if (serviceStores.length === 0) continue;
        // 
        const nearest = serviceStores.reduce((closest, current) => {
            const dist1 = getDistance(
                latitude,
                longitude,
                closest.latitude,
                closest.longitude
            );
            const dist2 = getDistance(
                latitude,
                longitude,
                current.latitude,
                current.longitude
            );
            return dist1 < dist2 ? closest : current;
        });
        const avgRating = calculateAverageRating(nearest.reviews);
        nearestStores.push({
            serviceType,
            distance: getDistance(
                latitude,
                longitude,
                nearest.latitude,
                nearest.longitude
            ),
            store: {
               store : nearest,
                averageRating: avgRating,
            },
        });
    }
    //
    if (nearestStores.length === 0)
        throw new NotFoundError("No nearby services found");
    //
    res.status(200).json({
        success: true,
        message:
            "Nearest active stores for each service type retrieved successfully",
        data: nearestStores,
    });
};

