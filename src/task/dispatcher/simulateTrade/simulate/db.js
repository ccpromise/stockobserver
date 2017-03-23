
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

exports.simulateCol = simulateCol;
// test
//doc: {_id, tradeplanId, secID, sdts, edts, hdts, ldts, sp, ep, hp, lp, closed}
simulateCol.remove({}).then(() => simulateCol.insert({'tradeplanId': 'MA1060', 'secID': '000001.xshe', 'sdts': 17200, 'edts': 17200, 'hdts': 17200, 'ldts': 17200, 'sp': 10, 'ep':5, 'hp': 5,
'lp': 5, 'closed': false
}));
//simulateCol.find({}).then(console.log);
