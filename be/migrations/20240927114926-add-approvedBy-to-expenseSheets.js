'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('expenseSheets', 'approvedBy', {
    //   type: Sequelize.STRING, // Change the type if needed
    //   allowNull: true, // Adjust according to your requirements
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('expenseSheets', 'approvedBy');
  }
};
