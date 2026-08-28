const router = require('express').Router();
const RegionController = require('../controllers/RegionController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', RegionController.getAll);
router.get('/:id', RegionController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), RegionController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), RegionController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), RegionController.remove);

module.exports = router;
