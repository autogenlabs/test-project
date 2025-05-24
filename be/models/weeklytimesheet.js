'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weeklyTimesheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  weeklyTimesheet.init({
    weekStart: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    time: DataTypes.DOUBLE,
    approvalStatus: DataTypes.STRING,
    comments: DataTypes.STRING,
    time: DataTypes.DOUBLE,
    overtime: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'weeklyTimesheet',
  });
  return weeklyTimesheet;
};