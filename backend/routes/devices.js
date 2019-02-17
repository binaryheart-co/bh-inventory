const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const DeviceModel = require("../models/device");
const { body, query, validationResult } = require('express-validator/check');
const ObjectId = require("mongoose").Types.ObjectId;

//{ type, subtype, code, note, description, estValue }
//RETURN: { fullID: 0119001A }
router.post("/", 
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

// {
//     "items": 50,
//     "tokenDirection": "before",
//     "tokenScore": 1.1,
//     "tokenID": "5c5fc12e52466eb092738529",
//     "search": "battery",
//     "minDate": "2019-02-07T23:51:58.479Z",
//     "maxDate": "2019-02-07T23:53:37.554Z",
//     "code[]": 4, "code[]": 5,
//     "type[]": "A", "type[]": "W",
//     "subtype[]": "L", "subtype[]": "D",
//     "minValue": 150,
//     "maxValue": 1200
// }
// Return: { devices: [], before: {direction, score, id}, after: {direction, score, id} }

//GET / Helper functions
const isValidDate = v => {
    let date;
    try { date = new Date(v) } 
    catch { return false }
    if(!+date) return false; //check for NaN, + tries to convert to number
    return true;
}

const isValidNumber = v => {
    if(+v) return true;
    return false;
}

router.get("/", 
    [
        query("items", "Item limit must be int between 10 and 100").optional({nullable: false})
            .custom(v => {
                //Check that items is valid int between 10 and 100
                if(Number.isInteger(+v)) return +v >= 10 && +v <= 100;
                return false;
            }),
        query("tokenDirection").optional({nullable: false}).isIn(["before", "after"]),
        query("tokenID")
            .custom((v, { req }) => {
                //Check that tokenID is valid if a tokenDirection is supplied
                try { if(req.query.tokenDirection && (!v || !ObjectId(v))) return false }
                catch { return false }
                return true;
            }),
        query("tokenScore", "Must be valid number").optional({nullable: false}).custom(isValidNumber),
        query("search").optional().isString(),
        query("minDate").optional().custom(isValidDate),
        query("maxDate").optional().custom(isValidDate),
        query("code", "An array with valid status codes is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        query("type", "An array with valid types is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        query("subtype", "An array with valid subtypes is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        query("minValue").optional({nullable: false}).custom(isValidNumber),
        query("maxValue").optional({nullable: false}).custom(isValidNumber),
    ],
    ensureAuthenticated, 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let { 
            items, tokenDirection, tokenScore, tokenID, search, minDate, 
            maxDate, code, type, subtype, minValue, maxValue
        } = req.query;
        if(code) code = code.map(Number);
        if(!items) items = 50;

        try {
            const devices = await DeviceModel.listDevices(
                +items, tokenDirection, +tokenScore, tokenID, search, minDate, maxDate, code,
                type, subtype, +minValue, +maxValue
            );
            return res.json(devices);
        }
        catch(e) {
            return next({catch: e});
        }
    }
);

module.exports = router;