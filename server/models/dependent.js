'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dependent extends Model {
    static associate(models) {
      dependent.belongsTo(models.employee);
    }
  }
  dependent.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'first_name is required' } },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'last_name is required' } },
      },
      relationship: DataTypes.STRING,
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'employeeId is required' } },
      },
    },
    {
      sequelize,
      modelName: 'dependent',
    }
  );
  return dependent;
};
