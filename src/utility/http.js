var http = require('http');
var config = require('../config');

/*
//for test
var fields = ['CODE', 'OPEN', 'PRICE', 'HIGH', 'LOW', 'HS', 'VOLUME', 'YESTCLOSE'];
var count = 4000;
var opt = {
    host: 'quotes.money.163.com',
    path: '/hs/service/diyrank.php',
    query: 'host=http%3A%2F%2Fquotes.money.163.com%2Fhs%2Fservice%2Fdiyrank.php&page=0&query=STYPE%3AEQA&fields='+fields.join('%2C')+'&count='+count+'&type=query',
    //headers: {
    //    host: 'quotes.money.163.com'
    //}
}
*/

function getRequestHead (opt) {
    var protocol = opt.protocol || 'http';
    var host = opt.host || '127.0.0.1';
    var port = opt.port || 80;
    var path = opt.path || '/';
    var query = opt.query || '';
    var headers = opt.headers || {};
    var requestHead = {
        path: protocol + '://' + host + (port === 80 ? '' : ':' + port) + path + (query === '' ? '' : '?' + query),
        host: host,
        port: port,
        headers: headers
    }
    if(config.isFiddler) {
        requestHead.host = config.fiddlerHost;
        requestHead.port = config.fiddlerPort;
        requestHead.headers.host = host;
    }
    //console.log(requestHead);
    return requestHead;
}

exports.request = function(opt) {
    return new Promise((resolve, reject) => {
        var req = http.get(getRequestHead(opt), (res) => {
            var data = [];
            res.on('data', (chunk) => { data.push(chunk); });
            res.on('end', () => { resolve(Buffer.concat(data)); });
        });//*
        req.on('err', reject);
        req.end();
    });
};//(opt).then((data) => { console.log(data);}).catch(err => {console.log('hehe')});
