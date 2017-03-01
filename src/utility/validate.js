
var DataPvd = require('../datapvd').DataPvd;
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

exports.isBool = function (val) {
    return typeof val === 'boolean';
}

exports.isDataPvd = function (val) {
    return val instanceof DataPvd;
}

exports.isDataPvdArr = function(val) {
    return val instanceof Array && val.every(exports.isDataPvd);
}

exports.isStock = function(val) {
    return val['data'] && val['minTs'] && val['maxTs'] && val['id'];
}

exports.isAny = function(val) {
    return true;
}

exports.isArr = function(val) {
    return val instanceof Array;
}
