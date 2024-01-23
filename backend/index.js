const express = require('express')
const app = express()
require('dotenv').config()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`The server is up and is running on the port: ${PORT}`)
})