const router = require("express").Router()

WAITING_FOR_CONFIRM = false

router.get("/test", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        res.send("Waiting for confirmation from partner server")
    }
    else {
        //DNS cache has cleared, updating DNS to point to partner server
        //TODO point dns to partner server 
        //TODO log dns cleared time
        WAITING_FOR_CONFIRM = true
        res.send("Cache has cleared, updating cache to point to new server")
    }
})

router.get("/confirm", (req, res) => {
    if (WAITING_FOR_CONFIRM) {
        WAITING_FOR_CONFIRM = false
        res.send("Confirmation that DNS has updated to point to second server recieved")
    }
    else {
        //TODO log this error case
        res.send(500, "Confirmation recieved before waiting for confirmation")
    }
})

module.exports = router
