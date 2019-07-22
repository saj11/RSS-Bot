require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const request = require("request")

const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server start running on PORT: ${PORT}`)
})