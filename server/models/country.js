'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class country extends Model {
    static associate(models) {
      country.belongsTo(models.region);
      country.hasMany(models.location, { onDelete: 'CASCADE' });
    }
  }
  country.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'name is required' } },
      },
      regionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'regionId is required' } },
      },
    },
    {
      sequelize,
      modelName: 'country',
    }
  );
  return country;
};
