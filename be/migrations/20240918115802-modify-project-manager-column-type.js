'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Check if project_manager has any foreign key and remove it
    // await queryInterface.removeConstraint('projects', 'project_manager', {});

    // // 2. Change the column type from STRING to INTEGER
    // await queryInterface.changeColumn('projects', 'project_manager', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });

    // // 3. Re-add the foreign key constraint
    // await queryInterface.addConstraint('projects', {
    //   fields: ['project_manager'],
    //   type: 'foreign key',
    //   name: 'projects_project_manager_fkey', // Custom constraint name
    //   references: {
    //     table: 'users',
    //     field: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Remove the foreign key constraint
    // await queryInterface.removeConstraint('projects', 'projects_project_manager_fkey');

    // // 2. Change the column back to STRING
    // await queryInterface.changeColumn('projects', 'project_manager', {
    //   type: Sequelize.STRING,
    // });
  },
};
