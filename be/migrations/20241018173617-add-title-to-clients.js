'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('Clients', 'title', {
    //   type: Sequelize.STRING,
    //   allowNull: true, // Change this based on your requirements
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('Clients', 'title');
  }
};