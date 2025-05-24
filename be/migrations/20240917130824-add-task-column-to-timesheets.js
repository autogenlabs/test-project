'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'task' column to the 'timesheets' table
    // await queryInterface.addColumn('timesheets', 'task', {
    //   type: Sequelize.STRING,
    //   allowNull: true, // Set to true if task can be null, otherwise false
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'task' column in case of rollback
    // await queryInterface.removeColumn('timesheets', 'task');
  },
};
