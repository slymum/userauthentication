const mongoose = require('mongoose');
const logger = require('../utilities/logger')
const username = require('../configs/dbConfig').username
const password = require('../configs/dbConfig').password
const cluster = require('../configs/dbConfig').cluster
const dbname = require('../configs/dbConfig').dbname
//connect to db
module.exports.initDB = function initDB() {
    mongoose.connect(
        `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(
        () => {
            logger.info("db connected")
        },
        err => {
            logger.error("unable to connect, please fix the mongo connection creds %s,", err)
            process.exit(1)
        }
    )
}


