const { department, location, employee } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(department, {
  searchField: 'name',
  include: [{ model: location }, { model: employee }],
  notFoundLabel: 'Department',
});
