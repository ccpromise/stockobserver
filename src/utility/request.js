
const http = require('http');
const https = require('https');
const config = require('../config');
const successStatusCode = /^[23]\d{2,2}$/;

/**
 * format http/https request object.
 * opt: {
    host: host
 *},
 * other optional fields in opt: port, path, query, method, headers, useHttps, data(for post)
 */
function getRequestObj(opt) {
    var useHttps = opt.useHttps || false;
    var host = opt.host;
    var port = opt.port || (useHttps ? 443 : 80);
    var path = opt.path || '/';
    var query = opt.query || '?';
    var method = opt.method || 'GET';
    var headers = opt.headers || Object.create(null);
    if (path[0] !== '/') path = '/' + path;
    if (query[0] !== '?') query = '?' + query;
    var requestObj = {
        host: host,
        port: port,
        path: path + query,
        method: method,
        headers: headers
    }
    // * use fiddler proxy to send request
    if (config.isFiddler) {
        requestObj.host = config.fiddlerHost;
        requestObj.port = config.fiddlerPort;
        requestObj.path = (useHttps ? 'https://' : 'http://') + host + ':' + port + path + query;
        requestObj.headers.host = host;
    }
    return requestObj;
}

/**
 * use http/https to send request.
 * if response code is 2XX / 3XX, return a resolved promise with the response body.
 * if any error occurs or response code is 4XX / 5XX, return a rejected promise with the reponse body.
 */
module.exports = function (opt) {
    return new Promise((resolve, reject) => {
        var requestObj = getRequestObj(opt);
        var req = (opt.useHttps && !config.isFiddler ? https : http).request(requestObj, (res) => {
            var content = [];
            res.on('data', (chunk) => { content.push(chunk); });
            res.on('end', () => {
                var data = Buffer.concat(content);
                if(successStatusCode.test(res.statusCode))
                    resolve(data);
                else reject(new Error(data.toString()));
            });
        });
        req.on('error', reject);
        if(opt.method === 'POST') {
            req.end(opt.data);
        }
        else req.end();
    });
}
