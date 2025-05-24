'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('weeklyTimesheets', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   weekStart: {
    //     type: Sequelize.DATE
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER
    //   },
    //   projectId: {
    //     type: Sequelize.INTEGER
    //   },
    //   time: {
    //     type: Sequelize.DOUBLE
    //   },
    //   approvalStatus: {
    //     type: Sequelize.BOOLEAN
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
    // await queryInterface.dropTable('weeklyTimesheets');
  }
};