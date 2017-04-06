
/**
 * trade plan collection
 */
const db = require('../db');
const plans = require('../../../../strategy/tradeplan');
const tradeplanCol = db.getCollection('tradeplan', {
    '_id': true,
    'desc': true,
    'dpInTmpl': true,
    'dpOutTmpl': true
});

exports.tradeplanCol = tradeplanCol;
