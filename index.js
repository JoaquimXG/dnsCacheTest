const app = require('express')()
const loggerMiddleware = require('./app/middleware/logger')
const log = require("./app/utils/logger")
const dnsTest = require("./app/routes/dns-cache-test")

const { HTTP_PORT } = require("./app/utils/dotenvDefault")

// app.use(loggerMiddleware)

app.use("/dns/", dnsTest)

app.get("*", (req, res) => {
    jsonResponse = {
        req: {
            headers: {
                cookie: req.cookies,
                sessionId: req.sessionID,
                accept: req.headers.accept,
            },
            method: req.method,
            sessionId: req.sessionId,
            originalUrl: req.originalUrl,
            query: req.query,
            body: req.body,
            params: req.params,
        }
    }
    res.send(`<pre>${JSON.stringify(jsonResponse, null, 2)}</pre>`)
})

app.listen(HTTP_PORT, () =>log.info(`Example app listening on port ${HTTP_PORT}`))