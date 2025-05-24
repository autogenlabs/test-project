'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'director_id' column to the 'Projects' table
    await queryInterface.addColumn('projects', 'director_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // Name of the table being referenced
        key: 'id', // Primary key in the referenced table
      },
      onUpdate: 'CASCADE', // Optional: Update 'director_id' when 'Users.id' changes
      onDelete: 'SET NULL', // Optional: Set 'director_id' to NULL if the referenced user is deleted
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'director_id' column from the 'Projects' table
    await queryInterface.removeColumn('projects', 'director_id');
  }
};
