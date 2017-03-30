
var db = require('../db');

exports.simulateCol = db.getCollection('simulate', {
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

exports.simdateCol = db.getCollection('simdateCol', {
    '_id': true,
    'tradeplanId': true,
    'secID': true,
    'lastSimDate': true
})
