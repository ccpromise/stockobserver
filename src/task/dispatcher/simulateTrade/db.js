
var Database = require('../../../utility').database;
var mongourl = require('../../../config').mongoUrl;
var db = new Database(mongourl);
var tradeplanCol = db.getCollection('tradeplan', { '_id': true, 'desc': true, 'dpInTmpl': true, 'dpOutTmpl': true });
//var plans = require('../../../strategy/tradePlan');
//tradeplanCol.remove({}).then(() => tradeplanCol.insertMany(Object.values(plans)));// for initald

var simulateCol = db.getCollection('simulate', {
    '_id': true,
    'tradeplanId': true,
    'secID': true,
    'sdts': true,
    'edts': true,
    'hdts': true,
    'ldts': true,
    'sp': true,
    'ep': true,
    'hp': true,
    'lp': true,
    'closed': true
});
exports.tradeplanCol = tradeplanCol;
exports.simulateCol = simulateCol;
