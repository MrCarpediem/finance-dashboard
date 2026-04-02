const userService = require('../services/user.service')

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const result = await userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
    })
    return res.status(200).json({ success: true, ...result })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id)
    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const updateRole = async (req, res) => {
  try {
    const user = await userService.updateRole(req.params.id, req.body.role)
    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: user,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

const updateStatus = async (req, res) => {
  try {
    const user = await userService.updateStatus(req.params.id, req.body.status)
    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: user,
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = { getAllUsers, getUserById, updateRole, updateStatus }