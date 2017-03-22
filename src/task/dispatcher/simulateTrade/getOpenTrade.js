
var simulateCol = require('./db').simulateCol;
var url = require('url');

module.exports = function(obj) {
    var req = obj.req;
    var res = obj.res;
    var filter = url.parse(req.url, true).query; //{'tradeplanId': , 'secID': , 'closed': }
    if(filter.closed) filter.closed = 'false' ? false : true;
    simulateCol.find(filter).then((r) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(r));
    }).catch((err) => {
        res.writeHead(500);
        res.end('[]');
    });
}
