'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // // Add the foreign key to expenseSheets
    // await queryInterface.addColumn('expenseSheets', 'projectId', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'projects', // Name of the target table
    //     key: 'id',         // Key in the target table to reference
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL', // Adjust the action according to your needs
    //   allowNull: true,      // This depends on your requirements
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key from expenseSheets
    // await queryInterface.removeColumn('expenseSheets', 'projectId');
  }
};
