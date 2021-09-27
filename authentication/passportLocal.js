passport = require("passport")
const userModel = require('../models/userModel')
const localStrategy = require('passport-local').Strategy;
const logger = require('../utilities/logger')


//create local strategy to authenticate to get user JWT
passport.use(
    'local',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                // check if given user is in the system
                const user = await userModel.findOne({"username":username});

                if (!user) {
                    logger.debug("username %s isn't found is the system",username)
                    return done(null, false, { message: 'User not found' });
                }


                // check if password is valid
                const validate = await user.isValidPassword(password);

                if (!validate) {
                    logger.debug("Invalid password for username %s",username)
                    return done(null, false, { message: 'Wrong Password' });
                }
                logger.debug("User %s is successfully authenticated with username and password",username)
                return done(null, user, { message: 'valid user' });
            } catch (error) {
                return done(error);
            }
        }
    )
);
