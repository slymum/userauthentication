const fs = require("fs");
const path = require("path");
//config for the server
module.exports = {
    PROTOCOL: "HTTP",  //can be HTTP or HTTPS
    PORT: process.env.PORT || 3000,  //port
    SERVER_KEY: fs.readFileSync(path.join(__dirname, '../certs/server.key'), 'utf8'),  //self signed localhost for HTTPS
    SERVER_CERT: fs.readFileSync(path.join(__dirname, '../certs/server.cert'), 'utf8') //self signed localhost for HTTPS
}
