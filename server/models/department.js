'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class department extends Model {
    static associate(models) {
      department.belongsTo(models.location);
      department.hasMany(models.employee);
    }
  }
  department.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'name is required' } },
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'locationId is required' } },
      },
    },
    {
      sequelize,
      modelName: 'department',
    }
  );
  return department;
};
