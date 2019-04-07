const { body } = require('express-validator/check');

const isValidDate = v => {
    let date;
    try { date = new Date(v) } 
    catch { return false }
    if(!+date) return false; //check for NaN, + tries to convert to number
    return true;
}

module.exports = {
    modifyValidator: [
        body("code", "Status codes range from -4 to 5").optional({nullable: false}).isInt({min: -4, max: 5}),
        body("note").optional({nullable: false}).isString().isLength({min: 1}),
        body("description").optional({nullable: false}).isString(),
        body("estValue").optional({nullable: false}).isFloat({min: 0, max: Number.MAX_SAFE_INTEGER}),
        body("receiver").optional({nullable: false}).isString(),
        body("updatedAt").custom(isValidDate),
    ]
};