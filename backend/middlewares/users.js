const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * verifies token from request header, if successful then puts userId into request
 */
module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = userId
    next()
  }
  catch (err) {
    res.status(411).json({ message: "Authentication Failed" })
  }
}