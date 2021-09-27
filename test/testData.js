const UNAUTHZ = {
    "code":401,
    "message": {"errorMessage":"Unauthorized"}
}

const ADMINUSER = {
    "userID": "admin",
    "permissions": {
        "/users": {
            "methods": [
                "GET",
                "POST",
                "PUT",
                "DELETE"
            ],
            "scope": [
                "ALL"
            ]
        },
        "/users/:id": {
            "methods": [
                "GET",
                "POST",
                "PUT",
                "DELETE"
            ],
            "scope": [
                "ALL"
            ]
        }
    }
}


const SUPERVISOR = {
   "permissions":  {
    "/users": {
        "methods": [
            "GET",
            "PUT"
        ],
            "scope": [
            "REPORT"
        ]
    },
    "/users/:id": {
        "methods": [
            "GET",
            "PUT"
        ],
            "scope": [
            "REPORT"
        ]
    }
},
    "userID":"test"
}


const EMP = {
    "permissions":  {
        "/users": {
            "methods": [
                "GET",
                "PUT"
            ],
            "scope": [
                "SELF"
            ]
        },
        "/users/:id": {
            "methods": [
                "GET",
                "PUT"
            ],
            "scope": [
                "SELF"
            ]
        }
    },
    "userID":"test"
}

const MOCK_FIND_USERS =[{
    "userID":"test2"
}]
module.exports = {
    ADMINUSER: ADMINUSER,
    UNAUTHZ: UNAUTHZ,
    SUPERVISOR: SUPERVISOR,
    MOCK_FIND_USERS: MOCK_FIND_USERS,
    EMP: EMP
}
