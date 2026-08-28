const router = require('express').Router();
const JobController = require('../controllers/JobController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', JobController.getAll);
router.get('/:id', JobController.getOne);
router.post('/', verifyToken, authorizeRoles('admin'), JobController.create);
router.put('/:id', verifyToken, authorizeRoles('admin'), JobController.update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), JobController.remove);

module.exports = router;
