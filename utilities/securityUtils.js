const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const {pathToRegexp} = require('path-to-regexp')
const key = fs.readFileSync(path.join(__dirname,'../certs/key.pem'),'utf8');
const userModel = require('../models/userModel')
const logger = require("../utilities/logger");
const jwtOpts = require("../configs/jwtConfig").options


/**
 * check if user has enough permission to access the route or resource
 * based on the permissions in user JWT will determine  if user access can be granted
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function isAuthorized(req,res,next){
    let user = req.user
    // read permission from request user
    let permissions = user.permissions
    // check if the  accessing route is present in user permission
    let foundRoute = matchRoute(req.originalUrl,permissions)

    //authorized if the accessing route isn't in the token
    if (foundRoute == ""){
        return res.status(401).json({"errorMessage":"Unauthorized"})
    }
    // if route found, continue to check user permissions for the accessing route
    let foundPermissions = permissions[foundRoute]
    let paramID = req.params.id
    //if there is  matching HTTP method for given route in the permission, continue to check for permission level
    if (foundPermissions['methods'].includes(req.method)){
        if (foundPermissions["scope"].includes("ALL")){  //if user has admin role, grant access
            return next()
        }else if(foundPermissions["scope"].includes("REPORT")){ //if user has supervisor role
            if (paramID == user.userID ){  //allow for self update and view
                return next()
            } else if(paramID){ //validate if user can grant access to asking resource
                let teamMembers = await userModel.find({'supervisor':user.userID})
                for (let i=0;i<teamMembers.length;i++){
                    if (teamMembers[i].userID == paramID){ // user is accessing their team members
                        return next()
                    }
                }
                //reject because user can't access other team members
                return res.status(401).json({"errorMessage":"Unauthorized"})
            }else{ //if no param, set isSupervisor flag to grant access or retrieve only team members under them
                req.isSupervisor = true
                return next()
            }
        }else{ //if user has only employee role
            if (user.userID == paramID){
                return next()
            }
            // EMP has no permission for the routes
            return res.status(401).json({"errorMessage":"Unauthorized"})
        }
    }
    // if route not found in the user permission, reject the access
    return res.status(401).json({"errorMessage":"Unauthorized"})

}

/**
 * generated and sign the JWT with the self signed cert
 * @param payload
 * @returns {*}
 */
generateJWT = (payload) => {
    return jwt.sign(payload,key,jwtOpts,)
}

/***
 * checking if the user is trying to access only the route in their JWT
 * @param path
 * @param permissions
 * @returns {string}
 */

function  matchRoute(path,permissions) {
    let match = false
    if (path.substr(-1) === '/') {
        path = path.substr(0, path.length - 1);
    }
    const routes = Object.keys(permissions);
    let size = routes.length;

    for (let i = 0; i < size; i++) {
        let pattern = routes[i];
        let keys = [];
        //create regex for each route in the permission then use the regex to match the access path
        const re = pathToRegexp(pattern, keys);
        match = re.exec(path);
        if (match) {
            logger.debug("pattern match found - " + pattern);
            return pattern;
        }
    }
    return ""
}


module.exports = {
    isAuthorized: isAuthorized,
    generateJWT: generateJWT
}

