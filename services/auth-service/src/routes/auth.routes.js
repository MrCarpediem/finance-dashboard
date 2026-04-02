const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/rbac.middleware')
const { validate, schemas } = require('../middleware/validate.middleware')

router.post('/register', validate(schemas.register), authController.register)
router.post('/login',    validate(schemas.login),    authController.login)
router.post('/refresh',                              authController.refresh)
router.post('/logout',   authenticate,               authController.logout)
router.get('/me',        authenticate,               authController.me)

module.exports = router