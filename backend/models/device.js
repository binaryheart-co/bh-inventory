const mongoose = require("mongoose");
const { Schema } = mongoose;
const { maxTaskPartners, skillAuthorizations } = require("../config");
const UserModel = require('./user');

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
        },
        weekDevice: {
            type: Number,
            required: [true, "A week-device number is required."],
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
        },
        location: {
            type: String,
        },
        // subtype: {
        //     type: String,
        // },
        code: {
            type: Number,
            required: [true, "A status code is required."],
            index: true,
        },
        notes: {
            type: [notesSchema],
        },
        description: {
            type: String,
            required: [true, "A device description is required."],
        },
        receiver: {
            type: String,
        },
        estValue: {
            type: Number,
            required: [true, "A price estimate is required."],
            min: 0,
            max: Number.MAX_SAFE_INTEGER,
            index: true,
        },
        volunteers: {
            type: [String],
            maxlength: [maxTaskPartners, `Only ${maxTaskPartners} volunteers can do a single task.`],
            index: true,
            default: [],
        },
        names: {
            type: [String],
            maxlength: [maxTaskPartners, `Only ${maxTaskPartners} volunteers can do a single task.`],
            index: true,
            default: [],
        },
        donor: String,
    },
    {
        timestamps: true,
    }
);

//special index for text search
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

deviceSchema.statics.listDevices = async function(
    items, tokenDirection, tokenScore, tokenID, search, minDate, maxDate, 
    code, type, minValue, maxValue, sort){
    try {
        let query;

        //APPLY THE FILTERS
        //Do mongo full-text search, add resultant score field
        if(search) {
            query = this.aggregate([
                { $match: { $text: { $search: search } } },
                { $addFields: { score: { $meta: "textScore" } } }
            ]);
        }
        else query = this.aggregate([]);

        //Filter the resultant devices
        if(minDate || maxDate) {
            const minD = new Date(minDate);
            const maxD = new Date(maxDate);
            const params = {}
            if(+minD) params.$gte = minD;
            if(+maxD) params.$lte = maxD;
            query.match({ createdAt: params });
        }
        if(code) query.match({ code: { $in: code } });
        if(type) query.match({ type: { $in: type } });
        if(minValue || maxValue) {
            const params = {}
            if(+minValue) params.$gte = +minValue;
            if(+maxValue) params.$lte = +maxValue;
            query.match({ estValue: params });
        }

        //Deal with tokens/paging if it is requested
        if(tokenDirection) {
            const id = new mongoose.Types.ObjectId(tokenID); //convert token id to valid mongo ObjectId

            //Define query params depend on after or before token
            let queryParams;
            if(tokenDirection === "after") queryParams = { order: -1, compare: "$lt" };
            else if(tokenDirection === "before") queryParams = { order: 1, compare: "$gt" };

            //Perform page query
            query.sort({ score: queryParams.order , _id: queryParams.order });
            if(tokenScore) {
                //Filter by token score, use token id if multiple documents same score
                query.match({ 
                    $or: [
                        { score: { [queryParams.compare]: tokenScore } },
                        {
                            score: tokenScore,
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
            if(sort==="old"){
                query.sort({ score: -1, _id: 1 }); //oldest ones on top
            }else{
                query.sort({ score: -1, _id: -1 }); //default sorting
            }
        }

        query.limit(items); //limit to requested number of devices

        const devices = await query.exec();
        if(tokenDirection === "before") devices.reverse(); //put docs back in right order if scrolling up
        const data = { devices: devices };

        // generate the tokens
        if(devices.length > 1) {
            const before = { 
                tokenDirection: "before", 
                tokenID: devices[0]._id.toString(),
            }
            const after = {
                tokenDirection: "after",
                tokenID: devices[devices.length - 1]._id.toString(),
            }
            if(search) {
                before.tokenScore = devices[0].score;
                after.tokenScore = devices[devices.length - 1].score;
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

deviceSchema.methods.updateDevice = async function(code, note, description, estValue, receiver, updatedAt, next) {
    //If the device has been updated since the client refreshed the page, send them the new device version
    const updated = new Date(updatedAt);
    if(this.updatedAt > updated) return next({validation: [{msg: "Out of date client device", updated: this}]});

    //!== undefined bc status 0 would return false
    if(code !== undefined) this.code = code;
    if(note !== undefined) this.notes.push({note: note, code: this.code});
    if(description !== undefined) this.description = description;
    if(estValue !== undefined) this.estValue = estValue;
    if(receiver !== undefined) this.receiver = receiver;

    try {
        await this.save();
        return true;
    } 
    catch (error) {
        return next({catch: error});
    }
}

//TASK CODE:

//adds user to existing task, or creates new task
deviceSchema.statics.assignTask = async function(volunteerSkill, volunteerID, volunteerName) {
    try {
        //select open task if availible
        // let goodTask = await this.findOne({volunteers: {$size: {$gt: 0, $lt: maxTaskPartners} } }).exec();
        // let goodTask = await this.findOne({ volunteers: {$exists: true} }).$where(function() {
        //     return this.volunteers.length > 0 && this.volunteers.length < maxTaskPartners;
        // });
        let goodTask = await this.findOne({$and: [
            {[`volunteers.${maxTaskPartners - 1}`]: {$exists: false}}, //size less than maxTaskPartners
            {[`volunteers.0`]: {$exists: true}}, //size greater than 0
            { volunteers: { $ne: volunteerID }}, //volunteer not already doing task
        ]}).exec();

        //if no open tasks, select a new task
        if (goodTask === null) {
            const authorizedCodes = skillAuthorizations[volunteerSkill];
            goodTask = await this.findOne({"volunteers.0": {$exists: false}, code: { $in: authorizedCodes } }).exec();
        }

        //if a task was selected, add the user to it and return it
        if (goodTask != null) {
            goodTask.volunteers.push(volunteerID);
            goodTask.names.push(volunteerName);
            await goodTask.save();
            return { task: goodTask };
        }
        else return { task: null } //if no task selected, return null
    } 
    catch (error) {
        return { error };
    }
}

deviceSchema.pre("save", async function() {
    try {
        if(!this.isModified("volunteers") || this.names === []) return;
        const names = await UserModel.idNames(this.volunteers);
        this.names = names.names;
        return;
    }
    catch(e) {
        throw new Error(e);
    }
});

//remove volunteers from completed task
deviceSchema.methods.clearVolunteers = async function() {
    this.volunteers = [];
    this.names = [];
}

module.exports = mongoose.model("Device", deviceSchema);