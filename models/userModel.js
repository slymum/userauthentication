const mongoose = require("mongoose");
const {genSaltSync, hash} = require("bcrypt");
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    roles: [{
        type: String,
        enum: ['EMP',"ADMIN","SUPERVISOR"],
        default: 'EMP'
    }],
    supervisor:{
        type: String
    },
    username:{
        type: String,
        required: true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre(['save'], async function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    const salt = genSaltSync(SALT_WORK_FACTOR);

    // hash the password using our new salt and overwrite cleartext password
    user.password = await hash(user.password, salt);
    next()
});

UserSchema.pre('findOneAndUpdate', async function () {
    let update = {...this.getUpdate()};

    // Only run this function if password was modified
    if (update.password){

        // Hash the password
        const salt = genSaltSync(SALT_WORK_FACTOR);
        update.password = await hash(this.getUpdate().password, salt);
        this.setUpdate(update);
    }
})

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

UserSchema.virtual('userID').get(function(){
    return this._id.toHexString();
});

const user = mongoose.model("user", UserSchema);

module.exports = user;
