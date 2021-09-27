const fs = require("fs");
const path = require("path");

//config for JWT
module.exports = {
    "issuer": "demo",
    "cert": fs.readFileSync(path.join(__dirname, '../certs/cert.crt'), 'utf8'),
    "options": {
        expiresIn: '30000000ms',
        algorithm: 'RS256',
        issuer: 'demo'
    }
}
