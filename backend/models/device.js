const mongoose = require("mongoose");
const { Schema } = mongoose;

// const escapeStringRegexp = require('escape-string-regexp');

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
            // validate: {
            //     validator: (v) => /^([ACIW])$/.test(v),
            //     message: "A,C,I, and W are valid device types."
            // },
        },
        subtype: {
            type: String,
            // validate: {
            //     validator: (v) => /^([LD])$/.test(v),
            //     message: "L and D are valid device subtypes."
            // }
        },
        code: {
            type: Number,
            required: [true, "A status code is required."],
            index: true,
            // min: -4,
            // max: 5,
            // default: 0,
        },
        notes: {
            type: [notesSchema],
            index: true,
        },
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
            // min: 0,
            // default: 0,
        },
        user: String,
        donor: String,
    },
    {
        timestamps: true,
    }
);

deviceSchema.index({ fullID: "text", description: "text", "notes.note": "text", receiver: "text" });

Date.prototype.getWeekYr = function() {
    const onejan = new Date(this.getFullYear(),0,1);
    let week = String(Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7));
    week = week.padStart(2, "0");
    const yr = (this.getFullYear().toString().substr(-2)).padStart(2, "0");
    return week + yr;
}

//generate unique ID method
deviceSchema.statics.getUniqueID = async function(next) {
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
        return next(error);
    }
}

// generate inventory list
// {
//     "order": "asc",
//     "items": 50,
//     "filters": {
//         "search": "battery",
//         "date": {
//             "min" : "2019-02-07T23:51:58.479Z",
//             "max" : "2019-02-07T23:53:37.554Z",
//         },
//         "code": [2,3,4,5],
//         "type": ["A", "W", "I"],
//         "subtype": ["L", "D"],
//         "value": {
//             "min": 150,
//             "max": 1200
//         }
//     }
// }

deviceSchema.query.searchFields = function(search) {
    return this.where(
        { $text: { $search: search } },
        { score: { $meta: "textScore" } }
    )
    .sort(
        { score: { $meta: "textScore" } }
    );
}

deviceSchema.query.date = function(min, max) {
    const params = {}
    if(+min) params.$gte = min;
    if(+max) params.$lte = max;
    return this.where({ createdAt: params });
}

deviceSchema.query.codes = function(codes) {
    return this.where({ code: { $in: codes } });
}

deviceSchema.query.types = function(types) {
    return this.where({ type: { $in: types } });
}

deviceSchema.query.subtype = function(subtypes) {
    return this.where({ subtype: { $in: subtypes } });
}

deviceSchema.query.valueRange = function(min, max) {
    const params = {}
    if(min) params.$gte = min;
    if(max) params.$lte = max;
    return this.where({ estValue: params });
}

deviceSchema.statics.listDevices = async function(order, items, before, after, filter) {
    try {
        let query = this.find();
        
        if(filter) {
            if(filter.search) {
                query = this.find(
                    { $text: { $search: filter.search } },
                    { score: { $meta: "textScore" } }
                ).sort(
                    { score: { $meta: "textScore" } }
                );
            }

            if(filter.date) {
                const minD = new Date(filter.date.min);
                const maxD = new Date(filter.date.max);
                query.date(minD, maxD);
            }
            if(filter.code) query.codes(filter.code);
            if(filter.type) query.types(filter.type);
            if(filter.subtype) query.subtype(filter.subtype);
            if(filter.value) query.valueRange(+filter.value.min, +filter.value.max);
        }

        const orderN = order === "asc" ? 1 : -1;
        query.sort({ createdAt: orderN });

        query.limit(items);
        return await query.exec();
    }
    catch(error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model("Device", deviceSchema);