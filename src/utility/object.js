
var validate = require('./validate');

exports.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

exports.contentEqual = function(obj1, obj2) {
    var keys = Object.keys(obj1);
    if(keys.length != Object.keys(obj2).length)
        return false;
    return keys.every((key) => { return key in obj2 &&
        (validate.isObj(obj1[key]) && validate.isObj(obj2[key]) ? contentEqual(obj1[key], obj2[key]) : obj1[key] === obj2[key]); });
}

exports.numOfKeys = function(obj) {
    return Object.keys(obj).length;
}

exports.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}
