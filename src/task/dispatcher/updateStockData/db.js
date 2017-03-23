
var db = require('../db');
exports.syncdateCol = db.getCollection('syncdateCol', { 'secID': true, 'syncdate': true });

//test
exports.syncdateCol.remove({});
