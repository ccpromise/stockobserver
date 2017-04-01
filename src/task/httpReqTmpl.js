

const config = require('../config');
const request = require('../utility').request;

/**
 * template of http request to dispatcher.
 */
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
