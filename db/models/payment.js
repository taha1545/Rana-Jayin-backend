"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("cash", "card", "transfer", "other"),
      defaultValue: "cash",
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "payments",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Payment;
};
