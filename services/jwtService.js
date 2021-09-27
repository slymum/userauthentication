const {generatedUserJWTPayload} = require("./userService");
const secuirtyUtils = require("../utilities/securityUtils");

// generated the signed JWT for given username, user need to be  present in the DB
generateUserJWT = async (username) => {
    let payload = await generatedUserJWTPayload(username)
    return secuirtyUtils.generateJWT(payload)
}

module.exports = {
    generateUserJWT:generateUserJWT
}


