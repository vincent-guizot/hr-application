const route = require('express').Router();

route.get('/', (req, res) => {
  res.status(200).json({ message: 'Home Page' });
});

route.use('/auth', require('./auth'));
route.use('/regions', require('./region'));
route.use('/countries', require('./country'));
route.use('/locations', require('./location'));
route.use('/departments', require('./department'));
route.use('/jobs', require('./job'));
route.use('/employees', require('./employee'));
route.use('/dependents', require('./dependent'));

module.exports = route;
