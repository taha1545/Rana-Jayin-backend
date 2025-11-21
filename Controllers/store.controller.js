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
            { model: db.StoreImage, as: "images", attributes: ["id", "imageUrl","isAllowed"] },
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

    // Validate coordinates
    if (!latitude || !longitude)
        throw new AppError("Latitude and longitude are required", 400);

    // Fetch all active stores with relations
    const allStores = await db.Store.findAll({
        where: { isActive: true },
        include: [
            {
                model: db.User,
                as: "owner",
            },
            { model: db.StoreImage, as: "images", attributes: ["id", "imageUrl","isAllowed"] },
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

    if (!allStores || allStores.length === 0)
        throw new NotFoundError("No active stores found");

    const nearestStores = [];

    // Loop through each service type required
    for (const serviceType of AllTypeServices) {

        // Filter stores that include this service type inside JSON array
        const serviceStores = allStores.filter(
            (store) =>
                Array.isArray(store.type) &&
                store.type.includes(serviceType)
        );

        if (serviceStores.length === 0) continue;

        // Find nearest store for this service type
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
                store: nearest,
                averageRating: avgRating,
            },
        });
    }

    if (nearestStores.length === 0)
        throw new NotFoundError("No nearby services found");

    res.status(200).json({
        success: true,
        message: "Nearest active stores for each service type retrieved successfully",
        data: nearestStores,
    });
};


//
exports.getStoreByMember = async (req, res) => {
    let { membreId } = req.body;
    if (!membreId) throw new NotFoundError("Member ID is required");
    //
    membreId = parseInt(membreId, 10);
    if (isNaN(membreId)) throw new NotFoundError("Member ID must be a valid number");
    // 
    const store = await db.Store.findOne({
        where: { userId: membreId },
        include: [
            {
                model: db.User,
                as: "owner",
                attributes: ["id", "name", "phone", "imagePath"],
                include: [{ model: db.Payment, as: "payments" }],
            },
            { model: db.StoreImage, as: "images", attributes: ["id", "imageUrl"] },
        ],
    });
    //
    if (!store) throw new NotFoundError("No store found for this member");
    //
    const storeJSON = store.toJSON();
    //
    const storeData = {
        ...StoreResource(store),
        member: store.owner
            ? {
                id: store.owner.id,
                name: store.owner.name,
                phone: store.owner.phone,
                imagePath: store.owner.imagePath || null,
            }
            : null,
        images: store.images || [],
        payments: store.owner?.payments || [],
    };
    //
    res.status(200).json({
        success: true,
        message: "Member store loaded successfully",
        data: storeData,
    });
};




