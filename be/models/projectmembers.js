'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projectMembers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.project, {
        foreignKey: 'projectId',
        as: 'project', // Alias for the project association
      });
      this.belongsTo(models.user, {
        foreignKey: 'memberId',
        as: 'user', // Alias for the project association
      });
    }
  }
  projectMembers.init({
    projectId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    isOwner: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'projectMembers',
  });
  return projectMembers;
};