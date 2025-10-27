"use strict";

module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define("Request", {
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "completed", "canceled"),
            defaultValue: "pending",
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    }, {
        tableName: "requests",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });

    Request.associate = (models) => {
        Request.belongsTo(models.User, { foreignKey: "clientId", as: "client" });
        Request.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
    };

    return Request;
};
