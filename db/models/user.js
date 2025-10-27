"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "member", "client"),
      allowNull: false,
      defaultValue: "client",
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "users",
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Store, { foreignKey: "userId", as: "stores" });
    User.hasMany(models.Request, { foreignKey: "clientId", as: "requests" });
    User.hasMany(models.Payment, { foreignKey: "userId", as: "payments" });
    User.hasMany(models.Review, { foreignKey: "clientId", as: "reviews" });
  };

  return User;
};
