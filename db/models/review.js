"use strict";

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: "reviews",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Store, { foreignKey: "storeId", as: "store" });
    Review.belongsTo(models.User, { foreignKey: "clientId", as: "client" });
  };

  return Review;
};
