'use strict';

module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "reports",
        timestamps: true,
        updatedAt: false,
    });

    return Report;
};
