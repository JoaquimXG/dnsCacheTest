const { PARTNER_DNS, PARTNER_IP, LOCAL_DNS } = require("../../utils/dotenvDefault")
const router = require("express").Router()
const axios = require("axios")
const updateRoute53 = require("./updateRoute53")
const log = require("../../utils/logger")
const cloudWatchLog = require("./cloudWatchLog")

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
            cloudWatchLog({ event: "CacheUpdated" , host: LOCAL_DNS, delay: dnsCacheDelay})
        }
        message = `Cache has cleared, pointing DNS to ${PARTNER_IP}`
        log.debug(message)

        await updateRoute53()
        cloudWatchLog({event: "DNSUpdated", host: LOCAL_DNS, target: PARTNER_IP})

        WAITING_FOR_CONFIRM = true
        log.debug(`Sending confirmation to partner: ${PARTNER_DNS}`)
        axios.get(`http://${PARTNER_DNS}/dns/confirm`)
            .then(res => {})
            .catch(err => {})

        res.send(message)
    }
})

router.get("/confirm", (req, res) => {
    if (WAITING_FOR_CONFIRM || FIRST_REQUEST) {
        WAITING_FOR_CONFIRM = false
        FIRST_REQUEST = false
        DNS_CHANGE_CONFIRM_TS = new Date()
        cloudWatchLog({event: "ConfirmationReceived", host: LOCAL_DNS})
        message = FIRST_REQUEST ?  "First confirmation received" : "Confirmation recieved"
        log.info(message)
        res.send(message)
    }
    else {
        cloudWatchLog({ error: true, event: "Confirmation recieved before waiting for confirmation" })
        message = "Confirmation recieved before waiting for confirmation"
        log.info(message)
        res.send(message)
    }
})

module.exports = router