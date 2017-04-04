
/**
 * handler of http request to query trade plan collection
 */
const tradeplanCol = require('./db').tradeplanCol;
const replaceObjId = require('../../../../utility').replaceObjId;
const dbOperation = require('../dbOperation');
const map = {
    'findOne': true
}

exports.tradeplan = function(arg, verb, res) {
    return dbOperation(tradeplanCol, arg, verb, res);
}
