const router = require("express").Router()
const http = require("http")
const fs = require("fs")

const { PARTNER_ADDRESS } = require("../../utils/dotenvDefault")

WAITING_FOR_CONFIRM = false
FIRST_REQUEST = true

const dnsLog = dict => {
    console.log("logging to file")
    dict = {ts: new Date().toISOString(), ...dict}
    fs.appendFile("./logs/dns-cache.log", `${JSON.stringify(dict)}\n`,
     err => { if (err) console.log(err) })
}

router.get("/test", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        res.send("Waiting for confirmation from partner server")
    }
    else {
        if (!FIRST_REQUEST) {
            dnsLog({event: "cacheCleared"})
        }

        //TODO point dns to partner server 
        WAITING_FOR_CONFIRM = true
        http.request({ hostname: PARTNER_ADDRESS, port: 80, path: "/dns/confirm", method: "GET" })

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