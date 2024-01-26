const router = require('express').Router()

// routes
router.use('/users', require('./users'))
router.use('/accounts', require('./accounts'))

// If route isn't present, then return error 404
router.use((req, res, next) => {
  res.status(404).json({ message: "Invalid route" })
})

// Middleware for catching errors
router.use((err, req, res, next) => {
  console.log(`Error : ${err}`)
  res.status(500).json({ message: "some error occurred", error: err })
})

module.exports = router