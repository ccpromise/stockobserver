
var tradeplanCol = require('./db').tradeplanCol;
var replaceObjId = require('../../../utility').replaceObjId;
var dbOperation = require('../dbOperation');
var map = {
    'findOne': true
}

module.exports = function(arg, verb, res) {
    dbOperation(tradeplanCol, arg, verb, res);
}
