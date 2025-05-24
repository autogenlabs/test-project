'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('expenseSheets', 'newMonth', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    
    // Migrate the data from month to newMonth
    await queryInterface.sequelize.query(`
      UPDATE "expenseSheets"
      SET "newMonth" = "month"
    `);
    
    // Remove the old column
    await queryInterface.removeColumn('expenseSheets', 'month');
    
    // Rename the new column
    await queryInterface.renameColumn('expenseSheets', 'newMonth', 'month');    
  },

  async down (queryInterface, Sequelize) {
  }
};
