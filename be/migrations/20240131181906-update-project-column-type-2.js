'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.changeColumn('projects', 'labour_budget', {
    //   type: Sequelize.DOUBLE
    // });
    // await queryInterface.changeColumn('projects', 'budget', {
    //   type: Sequelize.DOUBLE
    // });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
