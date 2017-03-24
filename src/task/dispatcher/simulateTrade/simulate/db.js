
var db = require('../../db');
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
var simTs = db.getCollection('simTs', {
    '_id': true,
    'tradeplanId': true,
    'secID': true,
    'simTs': true
})

exports.simulateCol = simulateCol;
exports.simTs = simTs;
