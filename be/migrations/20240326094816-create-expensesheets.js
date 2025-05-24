'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('expensesheets', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   expense: {
    //     type: Sequelize.DOUBLE
    //   },
    //   projectId: {
    //     type: Sequelize.INTEGER
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER
    //   },
    //   approvalStatus: {
    //     type: Sequelize.STRING
    //   },
    //   month: {
    //     type: Sequelize.STRING
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('expensesheets');
  }
};