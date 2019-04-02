const mongoose = require("mongoose");
const { Schema } = mongoose;
const maxTaxPartners = require("../config").maxTaskPartners;

const taskSchema = new Schema({
        deviceID: {
            type: String,
            required: [true, "A device ID is required."],
            index: true,
            unique: true,
        },
        skill: {
            type: Number,
            required: [true, "A minimum skill level is required."],
        },
        volunteers: {
            type: [String],
            maxlength: [maxTaxPartners, `Only ${maxTaxPartners} volunteers can do a single task.`],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);