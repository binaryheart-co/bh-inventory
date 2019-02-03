const mongoose = require("mongoose");
const { Schema } = mongoose;

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

const notesSchema = new Schema({
        note: {
            type: String,
            required: [true, "A note must contain a note!"],
        }
    },
    {
        timestamps: true,
    }
);

const deviceSchema = new Schema({
        type: {
            type: String,
            required: [true, "A device type is required."],
            validate: {
                validator: (v) => /^([ACIW])$/.test(v),
                message: "A,C,I, and W are valid device types."
            },
        },
        subtype: {
            type: String,
            validate: {
                validator: (v) => /^([LD])$/.test(v),
                message: "L and D are valid device subtypes."
            }
        },
        uniqueID: {
            type: Number,
            required: [true, "A unique device ID is required."],
            index: true,
            unique: true,
        },
        code: {
            type: Number,
            required: [true, "A status code is required."],
            index: true,
            min: -4,
            max: 5,
            default: 0,
        },
        user: String,
        notes: [notesSchema],
        description: {
            type: String,
            required: [true, "A device description is required."],
        },
        donor: String,
        receiver: {
            type: String,
            validate: {
                validator: (v) => /^(D[0-9]{7})$/.test(v),
                message: "Format like D2418004."
            },
        },
        estValue: {
            type: Number,
            required: [true, "A price estimate is required."],
            min: 0,
            default: 0,
        }
    },
    {
        timestamp: true,
    }
);

//generate unique ID method

//use regular function and not arrow function to work properly
// userSchema.pre("save", async function() {

//     try {
//         //only hash password if it has been modified (or is new)
//         if(!this.isModified("password")) return;
//         //generate a salt
//         const salt = await bcrypt.genSalt(hashCost)
//         //hash with the generated salt
//         const hash = await bcrypt.hash(this.password, salt);
//         //override the cleartext password with the hashed one
//         this.password = hash;
//         return;
//     }
//     catch(e) {
//         throw new Error(e);
//     }
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//     try {
//         return await bcrypt.compare(candidatePassword, this.password);
//     }
//     catch(e) {
//         throw new Error(e);
//     }
// }

module.exports = mongoose.model("Device", deviceSchema);