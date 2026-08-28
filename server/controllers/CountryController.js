const { country, region, location } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(country, {
  searchField: 'name',
  include: [{ model: region }, { model: location }],
  notFoundLabel: 'Country',
});
