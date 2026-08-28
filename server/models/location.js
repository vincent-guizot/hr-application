'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location extends Model {
    static associate(models) {
      location.belongsTo(models.country);
      location.hasMany(models.department, { onDelete: 'CASCADE' });
    }
  }
  location.init(
    {
      street_address: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'city is required' } },
      },
      state_province: DataTypes.STRING,
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'countryId is required' } },
      },
    },
    {
      sequelize,
      modelName: 'location',
    }
  );
  return location;
};
