
const tradeplanCol = require('./db').tradeplanCol;
const replaceObjId = require('../../../utility').replaceObjId;
const dbOperation = require('../dbOperation');
const map = {
    'findOne': true
}

exports.tradeplan = function(arg, verb, res) {
    dbOperation(tradeplanCol, arg, verb, res);
}
