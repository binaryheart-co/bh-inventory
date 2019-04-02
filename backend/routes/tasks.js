const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const { body, query, validationResult } = require('express-validator/check');
const TaskModel = require('../models/task');
const maxTaskPartners = require("../config").maxTaskPartners;

//returns a list of current tasks the user is undertaking
router.get("/",
    ensureAuthenticated, 
    async (req, res, next) => {
        try {
            const tasks = await TaskModel.find({volunteers: req.user._id}).exec();
            if (tasks != null && tasks.length > 0) {
                return res.json(tasks);
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
            //task schema method to assign user to open task if availible, otherwise generate task, otherwise return no availible tasks
        } 
        catch (error) {
            return next({catch: error});
        }
    }
);

module.exports = router;