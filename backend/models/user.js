const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const hashCost = require("../config").passwordHashCost;

const commonList = require("../utilities/passwordCheck/passwordCheck");

const userSchema = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
});

//use regular function and not arrow function to work properly
userSchema.pre("save", async function(next) {
    //only hash password if it has been modified (or is new)
    if(this.isModified("password")) return next();

    if(this.password.length < 8 || this.password.length > 64) {
        return next("The password must be between 8 and 64 characters long.");
    }

    if(commonList.test(this.password)) {
        return next("This is an insecure password. Try something memorable but unique.");
    }
    
    //generate a salt
    bcrypt.genSalt(hashCost, function(err, salt) {
        if(err) return next(err);

        //hash with the generated salt
        bcrypt.hash(this.password, salt, function(err, hash) {
            if(err) return next(err);

            //override the cleartext password with the hashed one
            this.password = hash;
            next();
        })
    })
    next();
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = mongoose.model("User", userSchema);