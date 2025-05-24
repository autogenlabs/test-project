'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('projects', 'project_manager', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'company', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('projects', 'project_manager');
    // await queryInterface.removeColumn('projects', 'company');
  }
};
