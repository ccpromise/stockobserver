var http = require('http');
var https = require('https');
var config = require('../config');

function getRequestObj(opt, usehttps) {
    var host = opt.host;
    var port = opt.port || (usehttps ? 443 : 80);
    var path = opt.path || '/';
    //in case the input path is something like 'abc/qq/index.html'
    if (path[0] !== '/') path = '/' + path;
    var query = opt.query || '';
    var headers = opt.headers || {};
    var requestObj = {
        host: host,
        port: port,
        path: path + (query === '' ? '' : ('?' + query)),
        headers: headers
    }
    if (config.isFiddler) {
        requestObj.host = config.fiddlerHost;
        requestObj.port = config.fiddlerPort;
        requestObj.path = (usehttps ? 'https://' : 'http://') + host + (port === 80 ? '' : (':' + port)) + requestHead.path;
        requestObj.headers.host = host;
    }
    return requestObj;
}

exports.request = function (opt, usehttps) {
    return new Promise((resolve, reject) => {
        var requestObj = getRequestObj(opt, usehttps);
        //if using fiddler, the request to fiddler must be http
        //its final protocal is specified in "path"
        var req = (usehttps && !config.isFiddler ? https : http).get(requestObj, (res) => {
            var data = [];
            res.on('data', (chunk) => { data.push(chunk); });
            res.on('end', () => { resolve(Buffer.concat(data)); });
        });//*
        req.on('error', (err) => reject('Error when connecting to host: ' + err.message)); //*
        req.end();
    });
}
