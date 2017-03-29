
const validate = require('./validate');

/**
 * create a clone of object
 */
exports.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * return if two objects have equal content
 */
exports.contentEqual = function(obj1, obj2) {
    if(!validate.isObj(obj1) || !validate.isObj(obj2)) return false;
    var keys = Object.keys(obj1);
    return keys.length === Object.keys(obj2).length && keys.every((key) => {
        return key in obj2 &&
        (validate.isObj(obj1[key]) && validate.isObj(obj2[key])
        ? contentEqual(obj1[key], obj2[key])
        : obj1[key] === obj2[key]); });
}

/**
 * return the number of keys
 */
exports.numOfKeys = function(obj) {
    return Object.keys(obj).length;
}

/**
 * return if an object is empty
 */
exports.isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}
