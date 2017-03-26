
var tradeplanCol = require('./db').tradeplanCol;
var replaceObjId = require('../../../utility').replaceObjId;
var dbOperator = require('../dbOperator');
var map = {
    'findOne': true
}

module.exports = function(arg, verb, res) {
    dbOperator(tradeplanCol, arg, verb, res);
}
