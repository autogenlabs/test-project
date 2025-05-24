'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('projects', 'project_manager');
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('projects', 'project_manager', {
    //   type: Sequelize.STRING, // Or whatever type it had before
    // });
  },
};
