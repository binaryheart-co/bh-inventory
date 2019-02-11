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

// {
//     "items": 50,
//     "token": {
//         "direction": "before",
//         "score": 1.1,
//         "id": "5c5fc12e52466eb092738529",
//     }
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

deviceSchema.statics.listDevices = async function(items, token, filter) {
    try {
        let query = this.aggregate([]);

        //apply the filters
        if(filter) {
            //Do mongo full-text search, add resultant score field
            if(filter.search) {
                query = this.aggregate([
                    { $match: { $text: { $search: filter.search } } },
                    { $addFields: { score: { $meta: "textScore" } } }
                ]);
            }

            //Filter the resultant devices
            if(filter.date) {
                const minD = new Date(filter.date.min);
                const maxD = new Date(filter.date.max);
                const params = {}
                if(+minD) params.$gte = minD;
                if(+maxD) params.$lte = maxD;
                query.match({ createdAt: params });
            }
            if(filter.code) query.match({ code: { $in: filter.code } });
            if(filter.type) query.match({ type: { $in: filter.type } });
            if(filter.subtype) query.match({ subtype: { $in: filter.subtype } });
            if(filter.value) {
                const params = {}
                if(+filter.value.min) params.$gte = +filter.value.min;
                if(+filter.value.max) params.$lte = +filter.value.max;
                query.match({ estValue: params });
            }
        }

        //Deal with tokens/paging if it is requested
        if(token) {
            const id = new mongoose.Types.ObjectId(token.id); //convert token id to valid mongo ObjectId

            //Define query params depend on after or before token
            let queryParams;
            if(token.direction === "after") queryParams = { order: -1, compare: "$lt" };
            else if(token.direction === "before") queryParams = { order: 1, compare: "$gt" };

            //Perform page query
            query.sort({ score: queryParams.order , _id: queryParams.order });
            if(token.score) {
                //Filter by token score, use token id if multiple documents same score
                query.match({ 
                    $or: [
                        { score: { [queryParams.compare]: token.score } },
                        {
                            score: token.score,
                            _id: { [queryParams.compare]: id },
                        }
                    ]
                });
            }
            else {
                query.match({ _id: { [queryParams.compare]: id } }); //Filter by token id
            }
        }
        else {
            query.sort({ score: -1, _id: -1 }); //default sorting
        }

        query.limit(items); //limit to requested number of devices

        const devices = await query.exec();
        if(token && token.direction === "before") devices.reverse(); //put docs back in right order if scrolling up
        const data = { devices: devices };

        // generate the tokens
        if(devices.length > 1) {
            const before = { 
                direction: "before", 
                id: devices[0]._id.toString(),
            }
            const after = {
                direction: "after",
                id: devices[devices.length - 1]._id.toString(),
            }
            if(filter && filter.search) {
                before.score = devices[0].score;
                after.score = devices[devices.length - 1].score;
            }
            data.before = before;
            data.after = after;
        }

        return data;
    }
    catch(error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model("Device", deviceSchema);