'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('timesheets', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   projectId: {
    //     type: Sequelize.INTEGER
    //   },
    //   date: {
    //     type: Sequelize.DATE
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER
    //   },
    //   task: {
    //     type: Sequelize.STRING
    //   },
    //   time: {
    //     type: Sequelize.DOUBLE
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
    // await queryInterface.dropTable('timesheets');
  }
};