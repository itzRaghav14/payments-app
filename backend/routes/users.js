const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { signUpSchema, signInSchema, updateSchema, bulkSchema } = require('../schemas/users')
const { authMiddleware } = require('../middlewares/users')
const Account = require('../models/Account')

router.post('/signup', async (req, res, next) => {
  try {
    const { success, data, error:parseError } = signUpSchema.safeParse(req.body)
    if (!success) {
      return res.status(422).json({ message: "Invalid Inputs", error: parseError })
    }

    const { username, firstName, lastName } = data
    const password = await bcrypt.hash(data.password, 10)

    const user = await User.findOne({ username })

    if (user) {
      return res.status(409).json({ message: "Username is already taken" })
    }

    const new_user = await User.create({ username, password, firstName, lastName })
    const new_account = await Account.create({ userId: new_user._id, balance: 1 + parseInt(Math.random() * 10000) })

    const userId = new_user.id
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 })
    res.status(200).json({ message: "User has been created", token })
  }
  catch(err) {
    next(err)
  }
})

router.post('/signin', async (req, res, next) => {
  try {
    const { success, data, error: parseError } = signInSchema.safeParse(req.body)
    if (!success) {
      return res.status(422).json({ message: "Invalid Inputs", error: parseError })
    }

    const { username, password } = data

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: "Username doesn't exist" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(403).json({ message: "Username or password is incorrect" })
    }

    const userId = user.id
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 })
    res.status(200).json({ message: "Authentication Successful", token })
  }
  catch(err) {
    next(err)
  }
})

router.put('/update', authMiddleware, async (req, res, next) => {
  try {
    const { success, data, error: parseError } = updateSchema.safeParse(req.body)
    if (!success) {
      return res.status(422).json({ message: "Invalid Inputs", error: parseError })
    }
    
    const userId = req.userId
    const { password, firstName, lastName } = data
    const user = await User.findById(userId)

    if (password) user.password = await bcrypt.hash(password, 10)
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    user.save()
    
    res.status(200).json({ message: "User Information has been updated" })
  }
  catch (err) {
    next(err)
  }
})

router.get('/bulk', async (req, res, next) => {
  try {
    // checking whether the given inputs follow the requirements or not
    const filter = req.query.filter || ''
    const { success, data, error: parseError } = bulkSchema.safeParse(filter)
    if (!success) {
      return res.status(422).json({ message: "Invalid Inputs", error: parseError })
    }

    // find all the users with the filter
    let users = await User.find({
      $or: [
        { username: { $regex: filter, $options: 'i' } },
        { firstName: { $regex: filter, $options: 'i' } },
        { lastName: { $regex: filter, $options: 'i' } },
      ]
    })

    // if no users are found with the applied filters
    if (users.length == 0) {
      return res.status(404).json({ message: "No users found with the current filter", users: [] })
    }

    // filter the data which has to be returned
    users = users.map(u => ({
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      id: u.id
    }))

    res.status(200).json({ message: "Found users with the filter successfully", users })
  }
  catch (err) {
    next(err)
  }
})

module.exports = router