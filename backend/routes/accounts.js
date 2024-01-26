const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const { authMiddleware } = require('../middlewares/users')
const Account = require('../models/Account')
const { transferSchema } = require('../schemas/accounts')

router.get('/balance', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId
    const account = await Account.findOne({ userId })
    const balance = account.balance

    res.status(200).json({ message: "Balanced fetched successfully", balance })
  }
  catch (err) {
    next(err)
  }
})

router.post('/transfer', authMiddleware, async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { success, data, error: parseError } = transferSchema.safeParse(req.body)
    if (!success) {
      await session.abortTransaction()
      return res.status(422).json({ message: "Invalid Inputs", error: parseError })
    }

    const userId = req.userId
    const { to: receiverId, amount } = data
    
    const account = await Account.findOne({ userId }).session(session)
    if (account.balance < amount) {
      await session.abortTransaction()
      return res.status(400).json("Insufficient Balance")
    }

    const receiverAccount = await Account.findOne({ userId: receiverId }).session(session)
    if (!receiverAccount) {
      await session.abortTransaction()
      return res.status(400).json("Invalid Account")
    }

    account.balance -= amount
    receiverAccount.balance += amount
    
    await Promise.all([account.save(), receiverAccount.save()])
    await session.commitTransaction()

    res.status(200).json({ message: "Transfer Successfully" })
  }
  catch (err) {
    await session.abortTransaction()
    next(err)
  }
  finally {
    await session.endSession()
  }
})

module.exports = router