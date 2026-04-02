const router = require('express').Router()
const userController = require('../controllers/user.controller')
const { authenticate, authorize } = require('../middleware/rbac.middleware')
const { validate, schemas } = require('../middleware/validate.middleware')

// All user routes require authentication
router.use(authenticate)

router.get('/',                              authorize('ADMIN'),            userController.getAllUsers)
router.get('/:id',                           authorize('ADMIN'),            userController.getUserById)
router.patch('/:id/role',   validate(schemas.updateRole),   authorize('ADMIN'), userController.updateRole)
router.patch('/:id/status', validate(schemas.updateStatus), authorize('ADMIN'), userController.updateStatus)

module.exports = router