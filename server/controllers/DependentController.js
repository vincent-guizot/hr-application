const { dependent, employee } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(dependent, {
  searchField: 'first_name',
  include: [{ model: employee }],
  notFoundLabel: 'Dependent',
});
