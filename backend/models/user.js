const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const hashCost = require("../config").passwordHashCost;

const userSchema = new Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        dropDups: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
});

//use regular function and not arrow function to work properly
userSchema.pre("save", async function(next) {
    const hashed = await bcrypt.hash(this.passwordHash, hashCost);
    this.passwordHash = hashed;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;