const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
        note: {
            type: String,
            required: [true, "A note must contain a note!"],
        },
        code: {
            type: Number,
            required: [true, "A status code is required."],
            min: -4,
            max: 5,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const deviceSchema = new Schema({
        weekYr: {
            type: String,
            required: [true, "A week-year is required."],
            index: true,
        },
        weekDevice: {
            type: Number,
            required: [true, "A week-device number is required."],
            index: true,
        },
        uniqueID: {
            type: String,
            required: [true, "A unique device ID is required."],
            index: true,
            unique: true,
        },
        fullID: {
            type: String,
            required: [true, "A full ID is required."],
            index: true,
            unique: true,
        },    
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
        code: {
            type: Number,
            required: [true, "A status code is required."],
            index: true,
            min: -4,
            max: 5,
            default: 0,
        },
        notes: [notesSchema],
        description: {
            type: String,
            required: [true, "A device description is required."],
        },
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
        },
        user: String,
        donor: String,
    },
    {
        timestamps: true,
    }
);

Date.prototype.getWeekYr = function() {
    const onejan = new Date(this.getFullYear(),0,1);
    let week = String(Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7));
    week = week.padStart(2, "0");
    const yr = (this.getFullYear().toString().substr(-2)).padStart(2, "0");
    return week + yr;
}

//generate unique ID method
deviceSchema.statics.getUniqueID = async function() {
    try {
        const weekYr = (new Date()).getWeekYr();
        const maxDevice = await this.findOne({weekYr: weekYr}).sort("-weekDevice").exec();
        if(maxDevice != null) {
            const weekDevice = maxDevice.weekDevice + 1
            const uniqueID = weekYr + String(weekDevice).padStart(3, "0");
            return {weekYr, weekDevice, uniqueID};
        }
        const weekDevice = 1;
        const uniqueID = weekYr + "001";
        return {weekYr, weekDevice, uniqueID};
    }
    catch(error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model("Device", deviceSchema);