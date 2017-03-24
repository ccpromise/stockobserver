
var db = require('./db');
var simulateCol = db.simulateCol;
var simTs = db.simTs;
var convertDocId = require('../../../../utility').convertDocId;
var simulateMap = {
    'insert': simulateCol.insert,
    'find': simulateCol.find,
    'updateMany': simulateCol.updateMany
}
var simTsMap = {
    'findOne': simTs.findOne,
    'upsert': simTs.upsert
}

// simulateCol accepts request from handler for 'simulate' task.
exports.simulate = function(args, verb, res) {
    if(!(verb in simulateMap)) {
        res.writeHead(400);
        res.end();
        return;
    }
    var argsCpy = convertDocId(args, verb);
    simulateMap[verb].apply(simulateCol, argsCpy).then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end('null');
        console.log(err);
    })
}

exports.simTs = function(args, verb, res) {
    if(!(verb in simTsMap)) {
        res.writeHead(400);
        res.end();
        return;
    }
    var argsCpy = convertDocId(args, verb);
    simTsMap[verb].apply(simTs, argsCpy).then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end('null');
        console.log(err);
    })
}
