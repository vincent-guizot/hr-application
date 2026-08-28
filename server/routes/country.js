const router = require('express').Router();
const CountryController = require('../controllers/CountryController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', CountryController.getAll);
router.get('/:id', CountryController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), CountryController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), CountryController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), CountryController.remove);

module.exports = router;
