'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('projects', 'project_manager', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'users', // Table name (assuming it's 'users')
    //     key: 'id', // Primary key in 'users' table
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL', // Or 'CASCADE' if you want to delete projects when a user is deleted
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeColumn('projects', 'project_manager');
  },
};
