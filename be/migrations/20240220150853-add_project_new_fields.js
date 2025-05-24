'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('projects', 'labour_varience', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'expense_varience', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'budget_varience', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'percentage', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'status', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'avg_rate_multiplier', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'labour_budget_varience', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('projects', 'labour_expense_varience', {
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
