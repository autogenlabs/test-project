'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('requests', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   projectId: {
    //     type: Sequelize.INTEGER
    //   },
    //   requestedBy: {
    //     type: Sequelize.INTEGER
    //   },
    //   requestedStatus: {
    //     type: Sequelize.STRING
    //   },
    //   approved: {
    //     type: Sequelize.BOOLEAN
    //   },
    //   approvedBy: {
    //     type: Sequelize.INTEGER
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
    // await queryInterface.dropTable('requests');
  }
};