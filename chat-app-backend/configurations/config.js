require('dotenv').config()

const {DB_URL, PORT, ACCESS_TOKEN} = process.env

module.exports = {DB_URL, PORT, ACCESS_TOKEN}