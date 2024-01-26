const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 16,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 16,
    trim: true
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User