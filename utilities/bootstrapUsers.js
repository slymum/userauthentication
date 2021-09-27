// utilities to bootstrap the system
const userModel = require("../models/userModel");
const logger = require("../utilities/logger")
const numberOfAdmin = 1
const numberOfSupervisor = 2
const numberOfTeamMember = 5
const defaultPassword = "password"

/**
 * create a user in the db
 * @param role
 * @param index
 * @param supervisor
 * @returns {Promise<Document<any, any, unknown> & Require_id<unknown>>}
 */
async function createUserUtils(role, index, supervisor = "") {
    let userPayload = {
        "firstName": "firstName" + role + index,
        "lastName": "lastName" + role + index,
        roles: [role],
        "password": defaultPassword,
        "email": "email" + role + index,
        "supervisor": supervisor,
        "username": role.toLowerCase() + index
    }


    const user = new userModel(userPayload);
    try {
        const createdUser = await user.save()
        return createdUser
    } catch (err) {
        logger.error("unable to create user %s", err)
    }
}

async function bootstrapUserUtils() {
    let supervisorList = []
    // prevent system from boostrap again
    if (await userModel.countDocuments() > 0) {
        logger.info("application was bootstrapped, skip user bootstrap step")
        return
    }
    logger.info("*******bootstrap  %s ADMIN(s)******", numberOfAdmin)
    for (let i = 0; i < numberOfAdmin; i++) {
        let user = await createUserUtils("ADMIN", i)
        logger.info("#####created ADMIN user, id: %s, username: %s, default password: %s", user.userID, user.username, defaultPassword)
    }

    logger.info("\n\n\n**********bootstrap %s Supervisor(s)**********", numberOfSupervisor)
    for (let i = 0; i < numberOfSupervisor; i++) {
        let user = await createUserUtils("SUPERVISOR", i)
        supervisorList.push(user.userID)
        logger.info("#####created SUPERVISOR userid: %s, username: %s, default password: %s", user.userID, user.username, defaultPassword)
    }


    logger.info("\n\n\n**********bootstrap team member(s)**********")
    for (let i = 0; i < supervisorList.length; i++) {
        logger.info("\n\n\n*****bootstrap %s members for supervisor: %s",numberOfTeamMember,supervisorList[i])
        for (let j = 0; j < numberOfTeamMember; j++) {
            let user = await createUserUtils("EMP", String(i) + String(j) , supervisorList[i])
            logger.info("#####created EMP user, id: %s, username: %s, defaultPassword: %s, supervisor %s", user.userID, user.username, defaultPassword, supervisorList[i])
        }
    }
}


module.exports = bootstrapUserUtils
