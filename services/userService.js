const _ = require('lodash');
const sanitize = require('mongo-sanitize')
const userModel = require('../models/userModel')
const logger = require('../utilities/logger')
const ROLE_META_DATA = require('../configs/rolesConfig')

/**
 * create user in the database with password filed encrypted
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
createUser = async function (req, res) {
    //sanitize input value
    req.body = sanitize(req.body)
    const user = new userModel(req.body);
    try {
        const createdUser = await user.save()
        logger.info("user %s is created by %s  ", createdUser.userID, req.user.userID)
        return res.status(201).send({"userID": createdUser.userID})
    } catch (err) {
        // there are required such as username, firstname, etc, if they are not passing in, send back bad request
        if (err.name == 'ValidationError') {
            return res.status(400).json(err)
        } else {
            return res.status(500).json(err)
        }
    }
}
/**
 * get user list based on the JWT,
 * if ADMIN return all users,
 * if SUPERVISOR return their team members
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
getAllUser = async function (req, res) {
    try {
        let filter = {}
        // if SUPERVISOR, create filter to select only their members and themselves
        if (req.isSupervisor) {
            filter = {
                $or: [
                    {'supervisor': req.user.userID},
                    {'_id': req.user.userID}
                ]
            }
            // filter = {"supervisor": req.user.userID}
        }
        let userList = await userModel.find(filter).select({"__v": 0});
        return res.status(200).json(userList)
    } catch (err) {
            return res.status(500).json(err)
    }
}

/**
 * delete a user based on id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
deleteUser = async function (req, res) {
    let isDeleted = 0
    try {
        isDeleted = await userModel.deleteOne({"_id": req.params.id})
    } catch (err) {
        logger.error("Error while deleting user %s", err)
        return res.status(500).json({"errorMessage": err})
    }

    if (isDeleted) {
        logger.info("user %s is deleted by %s  ", req.params.id, req.user.userID)
        return res.status(204).json({})
    } else {
        return res.status(400).json({"errorMessage": "Unable to delete user"})
    }
}

/**
 * update user based on id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
updateUser = async function (req, res) {
    let isUpdated = 0
    req.body = sanitize(req.body)
    let user = {};
    try {
        // update the user with given id , then return the new user
        user = await userModel.findOneAndUpdate({"_id": req.params.id}, req.body, {
            new: true,
            fields: {"_id": 0, "__v": 0, "password": 0}
        })
    } catch (err) {
        logger.error("Error while updating user %s", err)
        return res.status(500).json({"errorMessage": err})
    }

    if (user) {
        logger.info("user %s is updated by %s  ", req.params.id, req.user.userID)
        return res.status(200).json(user)
    } else {
        return res.status(400).json({"errorMessage": "Unable to update user"})
    }

}

/**
 * get a user by id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
getUser = async function (req, res) {
    try {
        //get a user by given id , filter out id, v and password field
        user = await userModel.findOne({"_id": req.params.id}).select({"_id": 0, "__v": 0, "password": 0});
        if (user) {
            return res.status(200).json(user)
        }
        return res.status(200).json({})

    } catch (err) {
            return res.status(500).json(err)
    }
}

/**
 * generated jwt payload for a given username if valid user in database
 * @param username
 * @returns {Promise<{}>}
 */
let generatedUserJWTPayload = async (username) => {
    let jwtPayload;
    try {
        let dbUser = await userModel.findOne({'username': username})
        jwtPayload = generatedPayload(dbUser)
        return jwtPayload
    } catch (err) {
        return {}
    }
}

/***
 * generated payload for a given user in db
 * @param dbUser
 * @returns {{}}
 */
let generatedPayload = (dbUser) => {
    let jwtPayload = {}
    jwtPayload.name = dbUser.firstName + ' ' + dbUser.lastName
    jwtPayload.email = dbUser.email
    let permissions = {}
    let roles = dbUser.roles
    // user can have multiple roles
    for (const role of roles) {
        // combine permissions for each roles in user permission
        Object.keys(ROLE_META_DATA[role]['permissions']).forEach(function (key) {
            //combine the method and scope for the route if route is existing route
            if (permissions[key]) {
                //combine the HTTP method
                permissions[key]['methods'] = _.union(ROLE_META_DATA[role]['permissions'][key]['methods'], permissions[key]['methods'])
                //combine the scope
                permissions[key]['scope'].push(ROLE_META_DATA[role]['permissions'][key]['scope'])

            } else { //new route
                let permissionScopes = []
                permissionScopes.push(ROLE_META_DATA[role]['permissions'][key]['scope'])
                permissions[key] = {
                    "methods": ROLE_META_DATA[role]['permissions'][key]['methods'],
                    "scope": permissionScopes
                }
            }
        });

    }

    jwtPayload.permissions = permissions
    jwtPayload.userID = dbUser.userID
    jwtPayload.sub = dbUser.userID
    jwtPayload.username = dbUser.username
    return jwtPayload;
}


module.exports = {
    createUser: createUser,
    getAllUser: getAllUser,
    getUser: getUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    generatedUserJWTPayload: generatedUserJWTPayload
}

