'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('projects', 'labour_effort', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'expense_effort', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
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
