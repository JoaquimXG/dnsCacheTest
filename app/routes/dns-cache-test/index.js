const { PARTNER_DNS, PARTNER_IP, LOCAL_IP, LOCAL_DNS } = require("../../utils/dotenvDefault")
const router = require("express").Router()
const http = require("http")
const axios = require("axios")
const dnsLog = require("./dnsLog")
const updateRoute53 = require("./updateRoute53")
const log = require("../../utils/logger")

DNS_CHANGE_CONFIRM_TS = null
WAITING_FOR_CONFIRM = false
FIRST_REQUEST = true

router.get("/test", async (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        message = "Refresh too early - Cache not cleared - Pending confirmation"
        log.warn(message)
        res.send(message)
    }
    else {
        if (!FIRST_REQUEST) {
            dnsCacheDelay = (new Date() - DNS_CHANGE_CONFIRM_TS) /1000
            dnsLog({ event: "CacheUpdated" , host: LOCAL_DNS, delay: dnsCacheDelay})
        }
        message = `Cache has cleared, pointing DNS to ${PARTNER_IP}`
        log.debug(message)

        await updateRoute53()
        dnsLog({event: "DNSUpdated", host: LOCAL_DNS, target: PARTNER_IP})

        WAITING_FOR_CONFIRM = true
        log.debug(`Sending confirmation to partner: ${PARTNER_DNS}`)
        axios.get(`http://${PARTNER_DNS}/dns/confirm`)
            .then(res => {})
            .catch(err => {})

        res.send(message)
    }
})

router.get("/confirm", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        WAITING_FOR_CONFIRM = false
        DNS_CHANGE_CONFIRM_TS = new Date()
        dnsLog({event: "ConfirmationReceived", host: LOCAL_DNS})
        message = "Confirmation recieved"
        log.info(message)
        res.send(message)
    }
    else if (FIRST_REQUEST) {
        FIRST_REQUEST = false
        DNS_CHANGE_CONFIRM_TS = new Date()
        dnsLog({event: "ConfirmationReceived", host: LOCAL_DNS})
        message = "First confirmation received"
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