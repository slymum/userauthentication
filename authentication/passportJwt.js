const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('../models/userModel')
const jwtConfig = require("../configs/jwtConfig")


//option to verify JWT
let opts = {}
// extract bearer token from JWT
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtConfig.cert;
opts.issuer = jwtConfig.issuer;

//create JWT strategy then assign to passport
passport.use ("jwt",new JwtStrategy(opts, function(jwt_payload, done) {
    userModel.findOne({_id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            //set permissions from verified JWT to user
            user.permissions = jwt_payload.permissions
            return done(null, user);
        } else {
            return done(null, false);

        }
    });
}));


