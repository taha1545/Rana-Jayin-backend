"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Contact", {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "contacts",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
    });
};
