'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class job extends Model {
    static associate(models) {
      job.hasMany(models.employee);
    }
  }
  job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'title is required' } },
      },
      min_salary: {
        type: DataTypes.INTEGER,
        validate: { min: { args: [0], msg: 'min_salary cannot be negative' } },
      },
      max_salary: {
        type: DataTypes.INTEGER,
        validate: { min: { args: [0], msg: 'max_salary cannot be negative' } },
      },
    },
    {
      sequelize,
      modelName: 'job',
      validate: {
        // Cross-field validation: keep the salary range sane.
        maxNotLessThanMin() {
          if (
            this.min_salary != null &&
            this.max_salary != null &&
            this.max_salary < this.min_salary
          ) {
            throw new Error('max_salary must be greater than or equal to min_salary');
          }
        },
      },
    }
  );
  return job;
};
