const router = require('express').Router();
const DepartmentController = require('../controllers/DepartmentController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', DepartmentController.getAll);
router.get('/:id', DepartmentController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), DepartmentController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), DepartmentController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), DepartmentController.remove);

module.exports = router;
