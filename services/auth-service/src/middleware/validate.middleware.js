const Joi = require('joi')

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map((d) => d.message),
    })
  }
  next()
}

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'ANALYST', 'VIEWER').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateRole: Joi.object({
    role: Joi.string().valid('ADMIN', 'ANALYST', 'VIEWER').required(),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
  }),
}

module.exports = { validate, schemas }