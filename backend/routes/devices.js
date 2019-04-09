const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");
const DeviceModel = require("../models/device");
const { validationResult, modifyValidator, queryValidator, newDeviceValidator } = require("../utilities/validators");

//{ type, code, note, description, estValue }
//RETURN: { fullID: 0119001A }
router.post("/", 
    newDeviceValidator,
    ensureAuthenticated(1), 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let {type, code, note, description, estValue} = req.body;
        type = String(type).toUpperCase();

        try {
            const {weekYr, weekDevice, uniqueID} = await DeviceModel.getUniqueID(next);
            const fullID = uniqueID + type;

            let notes;
            if(note) notes = [{note, code}];

            const device = new DeviceModel({
                weekYr, weekDevice, uniqueID, fullID, type, code, 
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
//     "minValue": 150,
//     "maxValue": 1200
// }
// Return: { devices: [], before: {direction, score, id}, after: {direction, score, id} }
router.get("/", 
    queryValidator,
    ensureAuthenticated(1), 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let { 
            items, tokenDirection, tokenScore, tokenID, search, minDate, 
            maxDate, code, type, minValue, maxValue
        } = req.query;
        if(code) code = code.map(Number);
        if(!items) items = 50;

        try {
            const devices = await DeviceModel.listDevices(
                +items, tokenDirection, +tokenScore, tokenID, search, minDate, maxDate, code,
                type, +minValue, +maxValue
            );
            return res.json(devices);
        }
        catch(e) {
            return next({catch: e});
        }
    }
);

// {
//     "code": 3,
//     "note": "battery added",
//     "description": "Apple iMac",
//     "estValue": 444,
//     "receiver": "23455874A",
//     "updatedAt": "2019-02-07T23:51:58.479Z"
// }
// Return: { updated: {//device here} } or { errors: [{ msg, updated: {//device here} }] } if bad updatedAt
router.put("/:fullID", 
    modifyValidator,
    ensureAuthenticated(0),
    async(req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        let { code, note, description, estValue, receiver, updatedAt } = req.body;
        let fullID = req.params.fullID;

        try {
            const device = await DeviceModel.findOne({fullID: fullID}).exec();
            if(!device) return next({errors: [{msg: `Can't find device ${fullID}`}]});
            if(await device.updateDevice(code, note, description, estValue, receiver, updatedAt, next)) {
                res.status(200).json({updated: device});
            }
        }
        catch(e) {
            return next({catch: e});
        }
    }
);

module.exports = router;