/**
 * role config
 * ADMIN will be able to create / update / delete / view users
 * SUPERVISOR will be able to View / update users who report to them
 * EMP will be able to only view / update info of themselves
 */
const ROLES = {
    "ADMIN": {  //role ID
        "permissions": {  // permissions for the ADMIN
            "/users": {  // allowed routes
                "methods": ["GET", "POST", "PUT", "DELETE"], //allowed method
                "scope": "ALL"  // scope for resource
            },
            "/users/:id": {
                "methods": ["GET", "POST", "PUT", "DELETE"],
                "scope": "ALL"
            },
        }
    }, "EMP": {
        "permissions": {
            "/users": {
                "methods": ["GET", "PUT"],
                "scope": "SELF"
            },
            "/users/:id": {
                "methods": ["GET", "PUT"],
                "scope": "SELF"
            },

        }
    }, "SUPERVISOR": {
        "id": "SUPERVISOR",
        "permissions": {
            "/users": {
                "methods": ["GET", "PUT"],
                "scope": "REPORT"
            },
            "/users/:id": {
                "methods": ["GET", "PUT"],
                "scope": "REPORT"
            },
        }
    }
}


module.exports = ROLES
