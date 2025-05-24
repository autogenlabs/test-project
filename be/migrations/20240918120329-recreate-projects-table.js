'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the existing projects table if it exists
    // await queryInterface.dropTable('projects');

    // Create the new projects table with the correct structure
    // await queryInterface.createTable('projects', {
      
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // In case you want to revert this migration, it will drop the table again
    // await queryInterface.dropTable('projects');
  },
};
