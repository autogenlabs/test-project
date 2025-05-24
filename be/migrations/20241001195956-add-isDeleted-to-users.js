'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('users', 'isDeleted', {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('users', 'isDeleted');
  }
};
