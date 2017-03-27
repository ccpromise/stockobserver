
var db = require('./db');
var simulateCol = db.simulateCol;
var lastSimDateCol = db.lastSimDateCol;
var dbOperator = require('../dbOperator');

// at now, we only have some general ops on collection, so we use dpOperator to handle it.
// in the future, if we get more complex task like taskManager/http, we define handler for this special case.
exports.simulate = function(arg, verb, res, req) {
    if(verb === 'getMul') {
        getAllSim(req, res);
    }
    else dbOperator(simulateCol, arg, verb, res);
}

exports.lastSimDate = function(arg, verb, res) {
    dbOperator(lastSimDateCol, arg, verb, res);
}

function getAllSim(req, res) {
    simulateCol.find({}).then((r) => {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': req.headers.origin,
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'],
            'Access-Control-Allow-Method': req.headers['access-control-request-method'],
            'Content-type': 'application/json'
        });
        res.end(JSON.stringify(r));
    })
}
