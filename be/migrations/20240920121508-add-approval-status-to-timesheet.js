'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.addColumn('timesheets', 'approvalStatus', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    //   defaultValue: 'notsubmitted',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // return queryInterface.removeColumn('timesheets', 'approvalStatus');
  }
};
