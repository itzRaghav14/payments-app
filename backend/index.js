const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('./config/mongoose')

// middlewares
app.use(require('morgan')('tiny'))
app.use(require('cors')())
app.use(require('body-parser').json())

// api requests
app.use('/api/v1', require('./routes'))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`The server is up and is running on the port: ${PORT}`)
})