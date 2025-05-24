'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('projects', 'project_manager', {
    //   type: Sequelize.STRING, // If you want to store as a string (or change it to INTEGER if referencing users)
    //   allowNull: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('projects', 'project_manager');
  },
};
