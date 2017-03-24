
var config = require('../../config');
var http = require('../../utility').http;

module.exports = function(path, data, verb) {
    var opt = {
        host: config.dispatcherHost,
        port: config.dispatcherPort,
        path: path,
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            verb: verb
        }
    }
    return http.request(opt);
}
