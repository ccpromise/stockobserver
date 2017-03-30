
exports.isStr = function (val) {
    return typeof val === 'string';
}

exports.isObj = function (val) {
    return typeof val === 'object' && !exports.isArr(val) && val !== null;
}

exports.isNum = function (val) {
    return typeof val === 'number';
}

exports.isBoolean = function (val) {
    return typeof val === 'boolean';
}

exports.isInt = function(val) {
    return exports.isNum(val) && val === Math.floor(val);
}

exports.isPosNum = function(val) {
    return exports.isNum(val) && val > 0;
}

exports.isPosInt = function(val) {
    return exports.isInt(val) && val > 0;
}

exports.isNonNegNum = function(val) {
    return exports.isNum(val) && val >= 0;
}

exports.isNonNegInt = function(val) {
    return exports.isInt(val) && val >= 0;
}

exports.isAny = function(val) {
    return true;
}

exports.isEmptyArr = function(arr) {
    return exports.isArr(arr) && arr.length === 0;
}

exports.isArr = function(val) {
    return Array.isArray(val);
}
