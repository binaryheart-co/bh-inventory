const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const hashCost = require("../config").passwordHashCost;

const userSchema = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: [true, "An email is required."],
    },
    password: {
        type: String,
        required: [true, "A password is required."],
    },
    firstName: {
        type: String,
        required: [true, "A first name is required."],
    },
    lastName: {
        type: String,
        required: [true, "A last name is required."],
    }
});

//use regular function and not arrow function to work properly
userSchema.pre("save", async function() {
    try {
        //only hash password if it has been modified (or is new)
        if(!this.isModified("password")) return;
        //generate a salt
        const salt = await bcrypt.genSalt(hashCost)
        //hash with the generated salt
        const hash = await bcrypt.hash(this.password, salt);
        //override the cleartext password with the hashed one
        this.password = hash;
        return;
    }
    catch(e) {
        throw new Error(e);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch(e) {
        throw new Error(e);
    }
}

module.exports = mongoose.model("User", userSchema);
