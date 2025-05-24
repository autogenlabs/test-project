'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.changeColumn('projects', 'project_manager', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'users', // Table name for users
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, revert the column change if needed
    // await queryInterface.changeColumn('projects', 'project_manager', {
    //   type: Sequelize.STRING, // Or whatever the original type was
    // });
  },
};
