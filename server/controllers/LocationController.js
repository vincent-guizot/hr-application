const { location, country, department } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(location, {
  searchField: 'city',
  include: [{ model: country }, { model: department }],
  notFoundLabel: 'Location',
});
