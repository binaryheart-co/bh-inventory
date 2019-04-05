const mongoose = require("mongoose");
const { Schema } = mongoose;
const { maxTaskPartners, skillAuthorizations } = require("../config");
const DeviceModel = require('./device');

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
            maxlength: [maxTaskPartners, `Only ${maxTaskPartners} volunteers can do a single task.`],
        },
    },
    {
        timestamps: true,
    }
);

//adds user to existing task, or creates new task
taskSchema.statics.assignTask = async function(volunteerSkill, volunteerID) {
    try {
        //if open task, add user to it
        const goodTask = await this.findOne({volunteers: {$size: {$lt: maxTaskPartners} } }).exec();
        if (tasks != null) {
            goodTask.volunteers.push(volunteerID);
            await goodTask.save();
            const device = await goodTask.getDeviceDetails().device;
            return { task: goodTask, device: device };
        }
        else return this.createTask(volunteerSkill, volunteerID); //if no open tasks, create a new task
    } 
    catch (error) {
        return { error };
    }
}

//creates new task for user
taskSchema.statics.createTask = async function(volunteerSkill, volunteerID) {
    try {
        //find a task the user is certified to do
        const authorizedCodes = skillAuthorizations[volunteerSkill];
        const device = await DeviceModel.findOne({code: {$in: authorizedCodes } }).exec();
        if (device != null) {
            const task = await this.create({ deviceID: device.fullID, skill: volunteerSkill, volunteers: [volunteerID] });
            const device = task.getDeviceDetails().device;
            return { task, device };
        }
        else return { task: null };
    } 
    catch (error) {
        return { error };
    }
}

//gets the full device details for the task device
taskSchema.methods.getDeviceDetails = async function() {
    try {
        const device = DeviceModel.findOne({ fullID: this.deviceID });
        if(device != null)
        {
            return { device } 
        }
        return { device: null };
    } 
    catch (error) {
        return { error };
    }
}

module.exports = mongoose.model("Task", taskSchema);