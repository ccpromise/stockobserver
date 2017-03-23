
var tradeplanCol = require('./db').tradeplanCol;
var convertDocId = require('../../../../utility').convertDocId;
var map = {
    'findOne': tradeplanCol.findOne,
}

module.exports = function(args, verb, res) {
    if(!(verb in map)) {
        res.writeHead(400);
        res.end();
        return;
    }
    var argsCpy = convertDocId(args);
    map[verb].apply(tradeplanCol, argsCpy).then((r) => {
        res.writeHead(200);
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end('null');
        console.log(err);
    })
}
