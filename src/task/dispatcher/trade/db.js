
var db = require('../db');
var strategy = require('../../../strategy/tradeplan');
var tradeplanCol = db.getCollection('tradeplan', { '_id': true, 'desc': true, 'dpInTmpl': true, 'dpOutTmpl': true });

exports.tradeplanCol = tradeplanCol;
