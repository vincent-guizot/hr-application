const router = require('express').Router();
const DependentController = require('../controllers/DependentController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', verifyToken, DependentController.getAll);
router.get('/:id', verifyToken, DependentController.getOne);
router.post('/', verifyToken, DependentController.create);
router.put('/:id', verifyToken, DependentController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), DependentController.remove);

module.exports = router;
