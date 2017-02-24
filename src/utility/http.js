var http = require('http');
var https = require('https');
var config = require('../config');

function getRequestHead (opt) {
    var host = opt.host;
    var port = opt.port || 80;
    var path = opt.path || '/';
    var query = opt.query || '';
    var headers = opt.headers || {};
    var requestHead = {
        host: host,
        port: port,
        path: path + (query === '' ? '' : '?' + query),
        headers: headers
    }
    if(config.isFiddler) {
        requestHead.host = config.fiddlerHost;
        requestHead.port = config.fiddlerPort;
        requestHead.path = (opt.protocol || 'http:') + '//' + host + (port === 80 ? '' : ':' + port) + requestHead.path;
        requestHead.headers.host = host;
    }
    return requestHead;
}

exports.request = function(opt) {
    return new Promise((resolve, reject) => {
        var header = getRequestHead(opt);
        var protocol = opt.protocol === 'https:' ? https : http;
        var req = http.get(header, (res) => {
            var data = [];
            res.on('data', (chunk) => { data.push(chunk); });
            res.on('end', () => { resolve(Buffer.concat(data)); });
        });//*
        req.on('error', (err) => reject('Error when connecting to host: ' + err.message)); //*
        req.end();
    });
}
