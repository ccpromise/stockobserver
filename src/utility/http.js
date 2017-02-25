var http = require('http');
var https = require('https');
var config = require('../config');

function getRequestObj(opt) {
    var host = opt.host;
    var port = opt.port || 80;
    var path = opt.path || '/';
    var query = opt.query || '';
    var headers = opt.headers || {};
    var requestObj = {
        host: host,
        port: port,
        path: path + (query === '' ? '' : ('?' + query)),
        headers: headers
    }
    if(config.isFiddler) {
        requestObj.host = config.fiddlerHost;
        requestObj.port = config.fiddlerPort;
        requestObj.path = (opt.protocol || 'http:') + '//' + host + (port === 80 ? '' : (':' + port)) + requestHead.path;
        requestObj.headers.host = host;
    }
    return requestObj;
}

exports.request = function(opt) {
    return new Promise((resolve, reject) => {
        var requestObj = getRequestObj(opt);
        var req = http.get(requestObj, (res) => {
            var data = [];
            res.on('data', (chunk) => { data.push(chunk); });
            res.on('end', () => { resolve(Buffer.concat(data)); });
        });//*
        req.on('error', (err) => reject('Error when connecting to host: ' + err.message)); //*
        req.end();
    });
}
