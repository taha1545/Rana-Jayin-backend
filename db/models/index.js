"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../../config/config.js").development;

const sequelize = new Sequelize(config);
const db = {};

// 
db.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.Contact = require("./contact.js")(sequelize, Sequelize.DataTypes);
db.Store = require("./store.js")(sequelize, Sequelize.DataTypes);
db.StoreImage = require("./storeImage.js")(sequelize, Sequelize.DataTypes);
db.Request = require("./request.js")(sequelize, Sequelize.DataTypes);
db.Review = require("./review.js")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment.js")(sequelize, Sequelize.DataTypes);

// 
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
