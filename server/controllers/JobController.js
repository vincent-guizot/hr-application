const { job, employee } = require('../models');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(job, {
  searchField: 'title',
  include: [{ model: employee }],
  notFoundLabel: 'Job',
});
