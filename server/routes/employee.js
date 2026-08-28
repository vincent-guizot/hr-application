const router = require('express').Router();
const EmployeeController = require('../controllers/EmployeeController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');
const selfOrAdmin = require('../middlewares/selfOrAdmin');

router.get('/', verifyToken, EmployeeController.getAll);
router.get('/:id', verifyToken, EmployeeController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), EmployeeController.create);
router.put('/:id', verifyToken, selfOrAdmin, EmployeeController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), EmployeeController.remove);

module.exports = router;
