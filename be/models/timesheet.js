'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class timesheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Timesheet belongs to a project
      this.belongsTo(models.project, {
        foreignKey: 'projectId',
        as: 'project', // Alias for the project association
      });
      this.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user', // Alias for the project association
      });
      
      // Other associations can be added here
      // Example: this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  timesheet.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'projects', // The table name for the project model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null
    },
    task: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null
    },
    time: {
      type: DataTypes.DOUBLE,
      allowNull: true, // Allow null
    },
    overtime: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: true,
    },
    entryType: {
      type: DataTypes.STRING,
      defaultValue: 'Hourly Work',
      allowNull: true, 
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Clients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    matter: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    privateDescription: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    showPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    approvalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "notsubmitted",
    },
  }, {
    sequelize,
    modelName: 'timesheet', // Ensure modelName matches Sequelize conventions
  });
  
  return timesheet;
};


























// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class timesheet extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // Timesheet belongs to a project
//       this.belongsTo(models.project, {
//         foreignKey: 'projectId',
//         as: 'project', // Alias for the project association
//       });
    
//       // If you need to include other associations, you can define them here as well.
//     }
//   }
//   timesheet.init({
//     projectId: DataTypes.INTEGER,
//     date: DataTypes.DATE,
//     // userId: DataTypes.INTEGER,
//     task: DataTypes.STRING,
//     time: DataTypes.DOUBLE,
//     overtime: {
//       type: DataTypes.DOUBLE,
//       defaultValue: 0
//     },
//     entryType: {
//         type: DataTypes.STRING,
//         allowNull: true, 
//         defaultValue: 'Hourly Work',
//     },
//     clientId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Clients', // The table name for the client model
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     },
//     matter: {
//       type: DataTypes.STRING,
//       allowNull: true, // Allow null
//     },
//     activity: {
//       type: DataTypes.STRING,
//       allowNull: true, // Allow null
//     },
//     task: {
//       type: DataTypes.STRING,
//       allowNull: true, // Allow null
//     },
//     privateDescription: {
//       type: DataTypes.TEXT,
//       allowNull: true, // Allow null
//     },
//     showPrivate: {
//       type: DataTypes.BOOLEAN,
//       allowNull: true,
//       defaultValue: false,
//     },
//     projectId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'projects', // The table name for the project model
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'users', // The table name for the user model
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     },
//     createdBy: {
//       type: DataTypes.INTEGER,
//       allowNull: true, // Allow null
//       references: {
//         model: 'users', // The table name for the user model
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     },
//     date: {
//       type: DataTypes.DATE,
//       allowNull: true, // Allow null
//     },
//     time: {
//       type: DataTypes.DOUBLE,
//       allowNull: true, // Allow null
//     },
//     overtime: {
//       type: DataTypes.DOUBLE,
//       allowNull: true,
//       defaultValue: 0,
//     },
//     cost: {
//       type: DataTypes.DOUBLE,
//       allowNull: true,
//       defaultValue: 0,
//     },
//     // createdAt: {
//     //   type: DataTypes.DATE,
//     //   allowNull: false,
//     //   defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
//     // },
//     // updatedAt: {
//     //   type: DataTypes.DATE,
//     //   allowNull: false,
//     //   defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
//     // },
//   }, {
//     sequelize,
//     modelName: 'timesheet',
//   });
//   return timesheet;
// };

