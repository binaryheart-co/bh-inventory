const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const DeviceModel = require("../models/device");
const { body, validationResult } = require('express-validator/check');

router.post("/register", 
    [
        body("type", "A,C,I, and W are valid device types.").isIn(["A", "a", "C", "c", "I", "i", "W", "w"]),
        body("subtype").custom((v, { req }) => {
            if(["A", "a", "W", "w"].includes(req.body.type)) {
                if(!v) throw new Error("Types A and W require a subtype.");
                else if(!["L", "l", "D", "d"].includes(v)) throw new Error("L and D are valid device subtypes.");
                else return true;
            }
            else if(v) throw new Error("Only types A and W should have a subtype.");
            return true;
        }),
        body("code", "Status codes range from -4 to 5").isInt({min: -4, max: 5}),
        body("note").optional().isString().isLength({min: 1}),
        body("description").isString().isLength({min: 1}),
        body("estValue").isFloat({min: 0}),
    ],
    ensureAuthenticated, 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let {type, subtype, code, note, description, estValue} = req.body;
        type = String(type).toUpperCase();
        subtype = String(subtype).toUpperCase();

        try {
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
            return next({catch: e});
        }
    }
);

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