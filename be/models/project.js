'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associate project with user through project_manager
      this.belongsTo(models.user, {
        foreignKey: 'project_manager',
        as: 'manager',
      });
      this.belongsTo(models.user, {
        foreignKey: 'director_id',
        as: 'directors',
      });
      this.hasMany(models.expenseSheets, {
        foreignKey: 'projectId',
        as: 'expenseSheets',
      });
      this.hasMany(models.projectMembers, {
        foreignKey: 'projectId',
        as: 'projectMember',
      });
    }
  }
  project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_fee: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      labour_budget: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      client_contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      chargeable_project: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      budget: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      project_manager: {
        type: DataTypes.INTEGER, // Ensure project_manager is an INTEGER to reference user ID
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      multiplier: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      client_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      director_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: 'users', // Ensure lowercase and matches the table name
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },
      budget_level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      finish_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      work_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      po_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      labour_varience: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      expense_varience: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      budget_varience: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avg_rate_multiplier: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      labour_budget_varience: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      labour_expense_varience: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      labour_effort: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      expense_effort: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      projectcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      delete_pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: DataTypes.fn('NOW'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: DataTypes.fn('NOW'),
      },
      // projectname: DataTypes.STRING,
      // total_fee: DataTypes.DOUBLE,
      // labour_budget: DataTypes.DOUBLE,
      // client_contact_email: DataTypes.STRING,
      // work_type: DataTypes.STRING,
      // organization: DataTypes.STRING,
      // client_name: DataTypes.STRING,
      // chargeable_project: DataTypes.BOOLEAN,
      // start_date: DataTypes.DATE,
      // budget: DataTypes.DOUBLE,
      // project_manager: DataTypes.STRING,
      // // project_manager: {
      // //   type: DataTypes.INTEGER,
      // //   references: {
      // //     model: 'users',
      // //     key: 'id',
      // //   },
      // //   onUpdate: 'CASCADE',
      // //   onDelete: 'SET NULL',
      // // },
      // company: DataTypes.STRING,
      // multiplier: DataTypes.DOUBLE,
      // client_number: DataTypes.STRING,
      // director: DataTypes.STRING,
      // budget_level: DataTypes.STRING,
      // client_title: DataTypes.STRING,
      // client_phone: DataTypes.STRING,
      // finish_date: DataTypes.DATE,
      // work_location: DataTypes.STRING,
      // po_number: DataTypes.STRING,
      // labour_varience: DataTypes.DOUBLE,
      // expense_varience: DataTypes.DOUBLE,
      // budget_varience: DataTypes.DOUBLE,
      // percentage: DataTypes.DOUBLE,
      // status: DataTypes.STRING,
      // avg_rate_multiplier: DataTypes.DOUBLE,
      // labour_budget_varience: DataTypes.DOUBLE,
      // labour_expense_varience: DataTypes.DOUBLE,
      // labour_effort: DataTypes.DOUBLE,
      // expense_effort: DataTypes.DOUBLE,
      // projectcode: DataTypes.STRING,
      // delete_pending: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false
      // },
      // // project_manager: {
      // //   type: DataTypes.INTEGER, // Change it to INTEGER if referencing user ID
      // //   references: {
      // //     model: 'users',
      // //     key: 'id',
      // //   },
      // //   onUpdate: 'CASCADE',
      // //   onDelete: 'SET NULL',
      // // },
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};