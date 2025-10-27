'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 
    await queryInterface.bulkInsert('users', [
      {
        name: 'wissam masri',
        phone: '0673442789',
        password: 'taha2005',
        role : 'admin'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
