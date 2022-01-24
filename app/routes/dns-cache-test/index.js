const { PARTNER_DNS } = require("../../utils/dotenvDefault")
const router = require("express").Router()
const http = require("http")
const dnsLog = require("./dnsLog")
const updateRoute53 = require("./updateRoute53")

WAITING_FOR_CONFIRM = false
FIRST_REQUEST = true

router.get("/test", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        res.send("Waiting for confirmation from partner server")
    }
    else {
        if (!FIRST_REQUEST) {
            dnsLog({event: "cacheCleared"})
        }
        
        updateRoute53()
        WAITING_FOR_CONFIRM = true
        http.request({ hostname: PARTNER_DNS, port: 80, path: "/dns/confirm", method: "GET" })

        res.send("Cache has cleared, updating cache to point to new server")
    }
})

router.get("/confirm", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        WAITING_FOR_CONFIRM = false
        FIRST_REQUEST = false
        res.send("Confirmation that DNS has updated to point to second server recieved")
    }
    else {
        dnsLog({error: true, event: "Confirmation recieved before waiting for confirmation"})
        res.status(500).send("Confirmation recieved before waiting for confirmation")
    }
})

module.exports = router