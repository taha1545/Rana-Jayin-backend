'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 
    await queryInterface.bulkInsert('users', [
      {
        name: 'Taha Mansouri',
        phone: '0673442786',
        password: 'taha2005',
      },
      {
        name: 'smail ferdi',
        phone: '0574365423',
        password: 'tahta2005',
      },
      {
        name: 'samed nigga',
        phone: '0782783223',
        password: 'taha2005',

      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
