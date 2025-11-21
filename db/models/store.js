"use strict";

module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define("Store", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        car: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        certificate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        priceRange: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "stores",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });

    Store.associate = (models) => {
        Store.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
        Store.hasMany(models.StoreImage, { foreignKey: "storeId", as: "images" });
        Store.hasMany(models.Request, { foreignKey: "storeId", as: "requests" });
        Store.hasMany(models.Review, { foreignKey: "storeId", as: "reviews" });
    };

    return Store;
};
