const { body, query, validationResult } = require('express-validator');
const ObjectId = require("mongoose").Types.ObjectId;

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

module.exports = {
    validationResult: validationResult,

    modifyValidator: [
        body("code", "Status codes range from -4 to 5").optional({nullable: false}).isInt({min: -4, max: 5}),
        body("note").optional({nullable: false}).isString().isLength({min: 1}),
        body("description").optional({nullable: false}).isString(),
        body("estValue").optional({nullable: false}).isFloat({min: 0, max: Number.MAX_SAFE_INTEGER}),
        body("receiver").optional({nullable: false}).isString(),
        body("updatedAt").custom(isValidDate),
    ],

    queryValidator: [
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
        // query("subtype", "An array with valid subtypes is needed.").optional({nullable: false})
        //     .isArray().isLength({min: 1}),
        query("minValue").optional({nullable: false}).custom(isValidNumber),
        query("maxValue").optional({nullable: false}).custom(isValidNumber),
    ],

    newDeviceValidator: [
        body("type", "A,C,I, and W are valid device types.").isIn(["A", "a", "C", "c", "I", "i", "W", "w"]),
        // body("subtype").custom((v, { req }) => {
        //     if(["A", "a", "W", "w"].includes(req.body.type)) {
        //         if(!v) throw new Error("Types A and W require a subtype.");
        //         else if(!["L", "l", "D", "d"].includes(v)) throw new Error("L and D are valid device subtypes.");
        //         else return true;
        //     }
        //     else if(v) throw new Error("Only types A and W should have a subtype.");
        //     return true;
        // }),
        body("code", "Status codes range from -4 to 5").isInt({min: -4, max: 5}),
        body("note").optional().isString().isLength({min: 1}),
        body("description").isString().isLength({min: 1}),
        body("estValue").isFloat({min: 0, max: Number.MAX_SAFE_INTEGER}),
    ]
};