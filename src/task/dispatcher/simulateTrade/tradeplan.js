
var tradeplanCol = require('./db').tradeplanCol;
var url = require('url');

module.exports = function(obj) {
    var req = obj.req;
    var res = obj.res;
    var id = url.parse(req.url, true).query._id;

    tradeplanCol.findOne({ '_id': id }, { 'dpInTmpl': true, 'dpOutTmpl': true }).then((r) => {
        if(r === null) {
            res.writeHead(400);
            res.end('null');
        }
        else {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(r));
        }
    }).catch((err) => {
        res.writeHead(500);
        res.end('null');
    });
}
