const { region, country } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(region, {
  searchField: 'name',
  include: [{ model: country }],
  notFoundLabel: 'Region',
});
