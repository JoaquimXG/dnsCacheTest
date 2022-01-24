require("dotenv").config()

HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : 80

module.exports = {
    HTTP_PORT
}