const router = require('express').Router();
const LocationController = require('../controllers/LocationController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', LocationController.getAll);
router.get('/:id', LocationController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), LocationController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), LocationController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), LocationController.remove);

module.exports = router;
