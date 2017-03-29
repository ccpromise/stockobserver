
const validate = require('./validate');
const ObjectId = require('mongodb').ObjectId;

/**
 * replace ObjectId-like string in inputument
 */
module.exports = function(input) {
    if(validate.isStr(input)) return convertObjId(input);
    if(validate.isNum(input) || validate.isBoolean(input)) return input;
    if(validate.isArr(input)) {
        return input.map((ele) => module.exports(ele));
    }
    if(validate.isObj(input)) {
        var inputCpy = Object.create(null);
        Object.keys(input).forEach((key) =>{
            inputCpy[key] = module.exports(input[key]);
        })
        return inputCpy;
    }
    return input;
}

/**
 return ObjectId instance if successfully transferred, otherwise return the original string
 */
function convertObjId(id) {
    try {
        var objId = new ObjectId(id);
    }
    catch (err) {
        return id;
    }
    return objId;
}
