
var db = require('../db');
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
var lastSimDateCol = db.getCollection('lastSimDateCol', {
    '_id': true,
    'tradeplanId': true,
    'secID': true,
    'lastSimDate': true
})

exports.simulateCol = simulateCol;
exports.lastSimDateCol = lastSimDateCol;
