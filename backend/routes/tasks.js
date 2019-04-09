const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const { validationResult, modifyValidator } = require("../utilities/validators");
const DeviceModel = require('../models/device');

//returns a list of current tasks the user is undertaking
router.get("/",
    ensureAuthenticated(1), 
    async (req, res, next) => {
        try {
            //try to find a list of tasks for the user
            let tasks = await DeviceModel.find({volunteers: req.user._id}).lean().exec();

            //return the list, or return [] if there are no tasks
            if(tasks === null || tasks.length === 0) tasks = [];
            // else { //add volunteer names to the returned tasks
            //     tasks = tasks.map(async function(element) {
            //         const names = await UserModel.idNames(element.volunteers);
            //         element.names = names.names;
            //         return element;
            //     });
            // }
            
            // return res.json({ tasks: await Promise.all(tasks) });
            return res.json({ tasks });
        }
        catch (error) {
            return next({catch: error});
        }
    }
);

//request a new task for the user
router.post("/",
    ensureAuthenticated(1), 
    async (req, res, next) => {
        try {
            const fullname = `${req.user.firstName} ${req.user.lastName}`;
            const task = await DeviceModel.assignTask(req.user.skill, req.user._id, fullname); //adds user to existing task, or creates new task
            if(!task.error && task.task) return res.json({ task: task.task }); //if successful, return the new task
            else if(!task.task) return res.json({ msg: "No availible tasks." }); //else, return no availible tasks
            else return next({catch: task.error}); // in case of server error
        } 
        catch (error) {
            return next({catch: error});
        }
    }
);

//quit a task
router.delete("/:fullID",
    ensureAuthenticated(1),
    async(req, res, next) => {
        const fullID = req.params.fullID;
        const user = req.user._id;

        try {
            const task = await DeviceModel.findOne({fullID: fullID, volunteers: user}).exec(); //find the task with given ID that user is working on
            if(task !== null) {
                const index = task.volunteers.indexOf(user);
                if (index > -1) task.volunteers.splice(index, 1);
                await task.save();
                return res.json({success: true});
            }
            else return next({code: 400, msg: `The user is not working on device ${fullID}`}); //else send error
        }
        catch (error) {
            return next({catch: error});
        }
    }
);

//complete a task, task submission form
router.put("/:fullID",
    modifyValidator,
    ensureAuthenticated(1),
    async(req, res, next) => {
        //validate and store json parameters
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});
        const { code, note, description, estValue, updatedAt } = req.body;

        //id and user parameters
        const fullID = req.params.fullID;
        const user = req.user._id;

        try {
            const device = await DeviceModel.findOne({fullID: fullID, volunteers: user}).exec();
            if(!device) return next({code: 400, msg: `The user is not working on device ${fullID}`});

            //update the device and clear the volunteers
            if(await device.updateDevice(code, note, description, estValue, undefined, updatedAt, next)) {
                device.clearVolunteers();
                await device.save();
                return res.status(200).json({updated: device});
            }
        }
        catch (error) {
            return next({catch: error});
        }
    }
)

module.exports = router;