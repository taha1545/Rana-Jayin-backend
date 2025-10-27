'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        onDelete: 'CASCADE',
      },
      serviceType: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'completed', 'canceled'),
        defaultValue: 'pending',
      },
      completedAt: { type: Sequelize.DATE, allowNull: true },
      latitude: { type: Sequelize.FLOAT, allowNull: false },
      longitude: { type: Sequelize.FLOAT, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requests');
  },
};
