'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expenseSheets extends Model {
    static associate(models) {
      // Define association here
      this.belongsTo(models.project, {
        foreignKey: 'projectId',
        as: 'project',
      });
    }
  }
  expenseSheets.init({
    expense: DataTypes.DOUBLE,
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    approvalStatus: DataTypes.STRING,
    month: DataTypes.DATE,
    category: DataTypes.STRING,
    approvedBy: DataTypes.STRING,
    imageUrls: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'expenseSheets',
  });
  return expenseSheets;
};