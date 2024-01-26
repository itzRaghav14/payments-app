const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
  .catch(error => {console.log(`Error in connecting to mongodb: ${err}`)})

mongoose.connection.on('connected', err => {
  console.log('Database has been connected')
})

mongoose.connection.on('error', err => {
  console.log(`Error in Mongoose: ${err}`)
})

module.exports = mongoose