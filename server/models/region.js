'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class region extends Model {
    static associate(models) {
      region.hasMany(models.country, { onDelete: 'CASCADE' });
    }
  }
  region.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'region name already exists' },
        validate: { notEmpty: { msg: 'name is required' } },
      },
    },
    {
      sequelize,
      modelName: 'region',
    }
  );
  return region;
};
