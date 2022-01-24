require("dotenv").config()

HTTP_PORT = process.env.HTTP_PORT ? process.env.HTTP_PORT : 80
PARTNER_ADDRESS = process.env.PARTNER_ADDRESS ? process.env.PARTNER_ADDRESS : null

module.exports = {
    HTTP_PORT,
    PARTNER_ADDRESS
}