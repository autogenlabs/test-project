'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // // Drop the existing 'timesheets' table
    // await queryInterface.dropTable('timesheets');

    // // Create the 'timesheets' table with the new structure
    // await queryInterface.createTable('timesheets', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     allowNull: false,
    //   },
    //   entryType: {
    //     type: Sequelize.STRING,
    //     allowNull: true, // Allow null
    //     defaultValue: 'Hourly Work',
    //   },
    //   clientId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //     references: {
    //       model: 'Clients', // The table name for the client model
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   },
    //   matter: {
    //     type: Sequelize.STRING,
    //     allowNull: true, // Allow null
    //   },
    //   activity: {
    //     type: Sequelize.STRING,
    //     allowNull: true, // Allow null
    //   },
    //   task: {
    //     type: Sequelize.STRING,
    //     allowNull: true, // Allow null
    //   },
    //   privateDescription: {
    //     type: Sequelize.TEXT,
    //     allowNull: true, // Allow null
    //   },
    //   showPrivate: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: true,
    //     defaultValue: false,
    //   },
    //   projectId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //     references: {
    //       model: 'projects', // The table name for the project model
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'users', // The table name for the user model
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   },
    //   createdBy: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true, // Allow null
    //     references: {
    //       model: 'users', // The table name for the user model
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   },
    //   date: {
    //     type: Sequelize.DATE,
    //     allowNull: true, // Allow null
    //   },
    //   time: {
    //     type: Sequelize.DOUBLE,
    //     allowNull: true, // Allow null
    //   },
    //   overtime: {
    //     type: Sequelize.DOUBLE,
    //     allowNull: true,
    //     defaultValue: 0,
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    //   },
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the 'timesheets' table if you rollback
    // await queryInterface.dropTable('timesheets');
  },
};
