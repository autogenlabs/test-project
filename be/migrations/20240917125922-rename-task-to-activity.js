'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.renameColumn('timesheets', 'task', 'activity');
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.renameColumn('timesheets', 'activity', 'task');
  },
};
