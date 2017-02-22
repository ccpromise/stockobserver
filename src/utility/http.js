var http = require('http');
var localhost = '127.0.0.1';
var localport = 8888;

exports.request = function(opt) {
    return new Promise((resolve, reject) => {
        var protocol = opt.protocol || 'http';
        var host = opt.host || '127.0.0.1';
        var port = opt.port || 80;
        var path = opt.path || '/';
        var query = opt.query || '';
        var header = opt.header || '';
        console.log({
            path: protocol + '://' + host + (port === 80 ? '' : ':' + port) + path + (query === '' ? '' : '?' + query),
            headers: {
                host: host
            },
            header: header,
            host: localhost,
            port: localport,
        });
        var req = http.get({
            path: protocol + '://' + host + (port === 80 ? '' : ':' + port) + path + (query === '' ? '' : '?' + query),
            headers: {
                host: host
            },
            header: header,
            host: localhost,
            port: localport,
        }, (res) => {
            var data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve(data); });
        });//*
        req.on('err', reject);
        req.end();
    });
}
