const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const DeviceModel = require("../models/device");

router.post("/register", ensureAuthenticated, async (req, res, next) => {
    try {
        let {type, subtype, code, note, description, estValue} = req.body;
        if(!type || !subtype || !code || !description || !estValue) {
            next(new Error("type, subtype, code, description and estValue are required."));
        }
    
        type = String(type).toUpperCase();
        subtype = String(subtype).toUpperCase();

        const {weekYr, weekDevice, uniqueID} = await DeviceModel.getUniqueID(next);
        const fullID = uniqueID + type + subtype;

        let notes;
        if(note) notes = [{note, code}];

        const device = new DeviceModel({
            weekYr, weekDevice, uniqueID, fullID, type, subtype, code, 
            notes, description, estValue
        });
        await device.save();
        res.json({fullID});
    }
    catch(e) {
        return next(e);
    }
});

router.post("/list", ensureAuthenticated, async (req, res, next) => {
    // try {
    //     let {sort, order, items, page, filter} = req.body;
    //     if(!sort || !order || !items || !page) {
    //         next(new Error("sort, order, items, and page are required"));
    //     }
    
    //     type = String(type).toUpperCase();
    //     subtype = String(subtype).toUpperCase();

    //     const {weekYr, weekDevice, uniqueID} = await DeviceModel.getUniqueID();
    //     const fullID = uniqueID + type + subtype;

    //     let notes;
    //     if(note) notes = [{note, code}];

    //     const device = new DeviceModel({
    //         weekYr, weekDevice, uniqueID, fullID, type, subtype, code, 
    //         notes, description, estValue
    //     });
    //     await device.save();
    //     res.json({fullID});
    // }
    // catch(e) {
    //     return next(e);
    // }
});

module.exports = router;