
var db = require('../db');
exports.syncdateCol = db.getCollection('syncdateCol', { 'secID': true, 'syncdate': true });

//init
exports.syncdateCol.remove({});
