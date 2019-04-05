const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
// const { body, query, validationResult } = require('express-validator/check');
const DeviceModel = require('../models/Device');

//returns a list of current tasks the user is undertaking
router.get("/",
    ensureAuthenticated, 
    async (req, res, next) => {
        try {
            const tasks = await DeviceModel.find({volunteers: req.user._id}).exec();

            if (tasks != null && tasks.length > 0) {
                return res.json({tasks: taskObjects});
            }
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
            if(!task.error && task.task) return res.json({ task: task.task });
            else if(!task.task) return res.json({ msg: "No availible tasks." });
            else return next({catch: task.error});
        } 
        catch (error) {
            return next({catch: error});
        }
    }
);

module.exports = router;