
var db = require('./db');
var simulateCol = db.simulateCol;
var lastSimDateCol = db.lastSimDateCol;
var dbOperator = require('../dbOperator');

// at now, we only have some general ops on collection, so we use dpOperator to handle it.
// in the future, if we get more complex task like taskManager/http, we define handler for this special case.
exports.simulate = function(arg, verb, res) {
    dbOperator(simulateCol, arg, verb, res);
}

exports.lastSimDate = function(arg, verb, res) {
    dbOperator(lastSimDateCol, arg, verb, res);
}
