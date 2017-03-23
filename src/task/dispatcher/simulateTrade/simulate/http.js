
var simulateCol = require('./db').simulateCol;
var convertDocId = require('../../../../utility').convertDocId;
var map = {
    'insert': simulateCol.insert,
    'find': simulateCol.find,
    'updateMany': simulateCol.updateMany
}

module.exports = function(args, verb, res) {
    if(!(verb in map)) {
        res.writeHead(400);
        res.end();
        return;
    }
    var argsCpy = convertDocId(args, verb);
    map[verb].apply(simulateCol, argsCpy).then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end('null');
        console.log(err);
    })
}
