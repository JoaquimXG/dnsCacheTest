const { PARTNER_DNS, PARTNER_IP, LOCAL_IP } = require("../../utils/dotenvDefault")
const router = require("express").Router()
const http = require("http")
const axios = require("axios")
const dnsLog = require("./dnsLog")
const updateRoute53 = require("./updateRoute53")
const log = require("../../utils/logger")

WAITING_FOR_CONFIRM = false
FIRST_REQUEST = true

router.get("/test", async (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        message = "Waiting for confirmation from partner server"
        log.info(message)
        res.send(message)
    }
    else {
        if (!FIRST_REQUEST) {
            dnsLog({ event: "requestRecieved" , server: LOCAL_IP})
        }

        await updateRoute53()
        dnsLog({event: "DNSUpdated", target: PARTNER_IP})

        WAITING_FOR_CONFIRM = true
        log.info("Sending confirmation to partner")
        axios.get(`http://${PARTNER_DNS}/dns/confirm`)
            .then(res => {})
            .catch(err => {})

        message = `Cache has cleared, pointing DNS to ${PARTNER_IP}`
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
        // dnsLog({ error: true, event: "Confirmation recieved before waiting for confirmation" })
        message = "Confirmation recieved before waiting for confirmation"
        log.info(message)
        res.send(message)
    }
})

module.exports = router