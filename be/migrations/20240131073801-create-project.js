'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectname: {
        type: Sequelize.STRING
      },
      total_fee: {
        type: Sequelize.INTEGER
      },
      labour_budget: {
        type: Sequelize.INTEGER
      },
      client_contact_email: {
        type: Sequelize.STRING
      },
      work_type: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      client_name: {
        type: Sequelize.STRING
      },
      chargeable_project: {
        type: Sequelize.BOOLEAN
      },
      start_date: {
        type: Sequelize.DATE
      },
      budget: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};