const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const DeviceModel = require("../models/device");
const { body, validationResult } = require('express-validator/check');
const ObjectId = require("mongoose").Types.ObjectId;

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
router.get("/list", 
    [
        body("items", "Item limit must be between 10 and 100").isInt({min: 10, max: 100}),
        body("filters.search").optional().isString().isLength({min: 1}),
        body("filters.date").optional().custom(v => {
            let min, max;
            try { min = new Date(v.min); max = new Date(v.max); }
            catch { throw new Error("A valid min or max date are needed."); }
            if(!+min && !+max) throw new Error("A valid min or max date is needed."); //check for NaN, + tries to convert to number
            return true;
        }),
        body("filters.code", "An array with valid status codes is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        body("filters.type", "An array with valid types is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        body("filters.subtype", "An array with valid subtypes is needed.").optional({nullable: false})
            .isArray().isLength({min: 1}),
        body("filters.value").optional({nullable: false}).custom(v => {
            let min, max;
            try { min = v.min; max = v.max; }
            catch { throw new Error("Valid min or max values are needed."); }
            if(!+min && !+max) throw new Error("Valid min or max values are needed.");
            return true;
        }),
        body("token").optional({nullable: false}).custom(v => {
            try {
                if(!["before", "after"].includes(v.direction)) throw new Error();
                if(v.score && !+v.score) throw new Error();
                if(!ObjectId(v.id)) throw new Error();
            }
            catch {
                throw new Error("Token requires valid direction, date, score, and id.");
            }
            return true;
        })
    ],
    ensureAuthenticated, 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let { items, token, filters } = req.body;

        try {
            const devices = await DeviceModel.listDevices(items, token, filters);
            return res.json(devices);
        }
        catch(e) {
            return next({catch: e});
        }
    }
);

module.exports = router;