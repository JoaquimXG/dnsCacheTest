const { PARTNER_DNS } = require("../../utils/dotenvDefault")
const router = require("express").Router()
const http = require("http")
const axios = require("axios")
const dnsLog = require("./dnsLog")
const updateRoute53 = require("./updateRoute53")
const log = require("../../utils/logger")

WAITING_FOR_CONFIRM = false
FIRST_REQUEST = true

router.get("/test", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        message = "Waiting for confirmation from partner server"
        log.info(message)
        res.send(message)
    }
    else {
        if (!FIRST_REQUEST) {
            dnsLog({ event: "cacheCleared" })
        }

        updateRoute53()
        WAITING_FOR_CONFIRM = true
        axios.get(`http://${PARTNER_DNS}/dns/confirm`)
            .then(res => {
                log.info(res.data)
            })
            .catch(err => {
                log.error(err)
            })

        message = "Cache has cleared, updating cache to point to new server"
        log.info(message)
        res.send(message)
    }
})

router.get("/confirm", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        WAITING_FOR_CONFIRM = false
        FIRST_REQUEST = false
        message = "Confirmation that DNS has updated to point to second server recieved"
        log.info(message)
        res.send(message)
    }
    else {
        dnsLog({ error: true, event: "Confirmation recieved before waiting for confirmation" })
        message = "Confirmation recieved before waiting for confirmation"
        log.info(message)
        res.send(message)
    }
})

module.exports = router