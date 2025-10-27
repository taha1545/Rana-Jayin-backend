const db = require("../db/models");
const { Op } = require("sequelize");

exports.getAnalytics = async (req, res) => {
    // Basic counts
    const totalUsers = await db.User.count();
    const totalMembers = await db.User.count({ where: { role: "member" } });
    const totalStores = await db.Store.count();
    const activeStores = await db.Store.count({ where: { isActive: true } });
    const inactiveStores = await db.Store.count({ where: { isActive: false } });
    // Payments
    const totalPayments = await db.Payment.count();
    const totalRevenue = await db.Payment.sum("price", { where: { status: "completed" } }) || 0;
    // Active subscriptions
    const activeSubscriptions = await db.Payment.count({
        where: {
            status: "completed",
            endDate: { [Op.gt]: new Date() },
        },
    });

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await db.Payment.findAll({
        attributes: [
            [
                db.sequelize.fn("TO_CHAR", db.sequelize.col("createdAt"), "YYYY-MM"),
                "month",
            ],
            [db.sequelize.fn("SUM", db.sequelize.col("price")), "total"],
        ],

        where: { status: "completed" },
        group: ["month"],
        order: [[db.sequelize.literal("month"), "ASC"]],
        limit: 6,
    });

    res.status(200).json({
        success: true,
        message: "Analytics retrieved successfully",
        data: {
            users: {
                total: totalUsers,
                members: totalMembers,
            },
            stores: {
                total: totalStores,
                active: activeStores,
                inactive: inactiveStores,
            },
            payments: {
                total: totalPayments,
                revenue: totalRevenue,
                activeSubscriptions,
            },
            charts: {
                monthlyRevenue,
            },
        },
    });
};
