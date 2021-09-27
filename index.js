const express = require("express"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");
    https = require('https');
const passport = require("passport");
    createUserService = require("./services/userService");
    swaggerOption = require("./configs/swaggerConfig")
    serverConfig = require("./configs/serverConfig")
    dbManager  = require("./utilities/dbManager")
    userRouter = require("./routes/userRoute")
    bootstrapUser = require("./utilities/bootstrapUsers")
    logger = require("./utilities/logger")
require('./authentication/passportLocal');
require('./authentication/passportJwt');
const jwtRouter = require("./routes/jwtRoute");

const app = express()

const specs = swaggerJsdoc(swaggerOption.options);
const serverOptions = {
    key: serverConfig.SERVER_KEY,
    cert: serverConfig.SERVER_CERT
}
app.disable('etag');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);
// intialize DB connection
dbManager.initDB()

// bootstrap user
bootstrapUser().then(()=>{
    logger.info("bootstrap users is done")
})
app.use(passport.initialize())


app.use("/users", passport.authenticate('jwt', { session: false }),userRouter);
app.use("/jwt", passport.authenticate('local', { session: false }),jwtRouter);

if (serverConfig.PROTOCOL =="HTTP"){
    app.listen(serverConfig.PORT)
}else{
    https.createServer(serverOptions,app).listen(serverConfig.PORT);
}

