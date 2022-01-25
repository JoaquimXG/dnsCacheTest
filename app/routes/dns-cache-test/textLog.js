
const fs = require("fs")

module.exports = dict => {
    dict = {ts: new Date().toISOString(), ...dict}
    fs.appendFile("./logs/dns-cache.log", `${JSON.stringify(dict)}\n`,
     err => { if (err) console.log(err) })
}
