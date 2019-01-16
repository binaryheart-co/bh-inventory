const mongoose = require("mongoose");
const { Schema } = mongoose;

const defaultCode = () => {
    return Math.floor(Math.random() * 1000000);
}

const registerCodeSchema = new Schema({
        code: {
            type: Number,
            required: true,
            min: 100000,
            max: 999999,
            default: defaultCode(),
        }
    },
    {
        timestamps: true,
    }
);

const registerCode = mongoose.model("Register Code", userSchema);
module.exports = registerCode;