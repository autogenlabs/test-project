'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('users', 'otp', {
    //   type: Sequelize.STRING,
    //   allowNull: true, // You can change this based on your requirements
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('users', 'otp');
  }
};
