const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
// const { body, query, validationResult } = require('express-validator/check');
const DeviceModel = require('../models/device');

//returns a list of current tasks the user is undertaking
router.get("/",
    ensureAuthenticated, 
    async (req, res, next) => {
        try {
            //try to find a list of tasks for the user
            let tasks = await DeviceModel.find({volunteers: req.user._id}).exec();

            //return the list, or return [] if there are no tasks
            if(tasks === null || tasks.length === 0) tasks = [];
            return res.json({ tasks });
        }
        catch (error) {
            return next({catch: error});
        }
    }
);

//request a new task for the user
router.put("/",
    ensureAuthenticated, 
    async (req, res, next) => {
        try {
            const task = await DeviceModel.assignTask(req.user.skill, req.user._id); //adds user to existing task, or creates new task
            if(!task.error && task.task) return res.json({ task: task.task }); //if successful, return the new task
            else if(!task.task) return res.json({ msg: "No availible tasks." }); //else, return no availible tasks
            else return next({catch: task.error}); // in case of server error
        } 
        catch (error) {
            return next({catch: error});
        }
    }
);

module.exports = router;