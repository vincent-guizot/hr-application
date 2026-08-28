'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      employee.belongsTo(models.department);
      employee.belongsTo(models.job);
      employee.hasMany(models.dependent, { onDelete: 'CASCADE' });
    }

    // Instance helper used by AuthController to check a plaintext password
    // against the stored bcrypt hash.
    comparePassword(plainPassword) {
      return bcrypt.compare(plainPassword, this.password);
    }

    // Belt-and-suspenders: defaultScope keeps password out of find*() results,
    // but create()/save() return the in-memory instance regardless of scope.
    // Stripping it here too means a plain JSON.stringify(employeeInstance)
    // can never leak the hash by accident.
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  employee.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'email is already registered' },
        validate: { isEmail: { msg: 'must be a valid email address' } },
      },
      phone_number: DataTypes.STRING,
      hire_date: DataTypes.DATE,
      jobId: DataTypes.INTEGER,
      salary: {
        type: DataTypes.INTEGER,
        validate: { min: { args: [0], msg: 'salary cannot be negative' } },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'employee',
        validate: { isIn: { args: [['employee', 'admin']], msg: 'role must be employee or admin' } },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: DataTypes.STRING,
      departmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'employee',
      defaultScope: {
        // Never leak the password hash on normal queries.
        attributes: { exclude: ['password'] },
      },
      scopes: {
        // Explicitly opt in when the hash is actually needed (login).
        withPassword: {
          attributes: {},
        },
      },
      hooks: {
        beforeCreate: async (emp) => {
          if (emp.password) {
            emp.password = await bcrypt.hash(emp.password, 10);
          }
        },
        beforeUpdate: async (emp) => {
          if (emp.changed('password') && emp.password) {
            emp.password = await bcrypt.hash(emp.password, 10);
          }
        },
      },
    }
  );

  return employee;
};
