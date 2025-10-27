"use strict";

module.exports = (sequelize, DataTypes) => {
    const StoreImage = sequelize.define("StoreImage", {
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "storeImages",
        timestamps: false,
    });

    StoreImage.associate = (models) => {
        StoreImage.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
    };

    return StoreImage;
};
