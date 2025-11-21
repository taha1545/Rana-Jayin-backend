'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storeImages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        onDelete: 'CASCADE',
      },
      isAllowed: {
        type: Sequelize.BOOLEAN, defaultValue: true
      },
      imageUrl: { type: Sequelize.STRING, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('storeImages');
  },
};
