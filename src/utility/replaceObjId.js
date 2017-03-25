
var validate = require('./validate');
var ObjectId = require('mongodb').ObjectId;
var convertObjId = function(id) {
    try {
        var objId = new ObjectId(id);
    }
    catch (err) {
        return id;
    }
    return objId;
}

var replaceObjId = function(arg) {
    if(validate.isStr(arg)) return convertObjId(arg);
    if(validate.isNum(arg) || validate.isBoolean(arg)) return arg;
    if(validate.isArr(arg)) {
        return arg.map((ele) => replaceObjId(ele));
    }
    if(validate.isObj(arg)) {
        var argCpy = {};
        Object.keys(arg).forEach((key) =>{
            argCpy[key] = replaceObjId(arg[key]);
        })
        return argCpy;
    }
    return arg;
}

module.exports = replaceObjId;
