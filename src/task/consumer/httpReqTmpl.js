
var config = require('../../config');
var request = require('../../utility').request;

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
    return request(opt);
}
