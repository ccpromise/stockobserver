
var DataPvd = require('../dataPvd/pvdClass/basicDataPvd/DataPvd');
var Stock = require('../stockdata').Stock;

exports.isStr = function (val) {
    return typeof val === 'string';
}

exports.isObj = function (val) {
    return typeof val === 'object';
}

exports.isNum = function (val) {
    return typeof val === 'number';
}

exports.isBoolean = function (val) {
    return typeof val === 'boolean';
}

exports.isInt = function(val) {
    return typeof val === 'number' && val === Math.floor(val);
}

exports.isPosNum = function(val) {
    return typeof val === 'number' && val > 0;
}

exports.isPosInt = function(val) {
    return typeof val === 'number' && val > 0 && val === Math.floor(val);
}

exports.isNonNegNum = function(val) {
    return typeof val === 'number' && val >= 0;
}

exports.isNonNegInt = function(val) {
    return typeof val === 'number' && val >= 0 && val === Math.floor(val);
}

exports.isBool = function (val) {
    return typeof val === 'boolean';
};

exports.isDataPvd = function (val) {
    return val instanceof DataPvd;
};

exports.isStock = function(val) {
    return val['data'] && val['minTs'] && val['maxTs'] && val['id'];
}

exports.isAny = function(val) {
    return true;
}

exports.isEmptyArr = function(arr) {
    return arr instanceof Array && arr.length === 0;
}

exports.isArr = function(val) {
    return Array.isArray(val);
}
