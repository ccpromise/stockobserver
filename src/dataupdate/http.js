
var createServer = require('http').createServer;
var utility = require('../utility');
var http = utility.http;
var file = utility.file;
var config = require('../config');
var tmp = require('tmp');

exports.getReadyTask = function() {
    var opt1 = {
        host: config.localHost,
        port: config.localPort,
        path: '/getReadyTask.json'
    };
    var opt2 = {
        host: config.localHost,
        port: config.localPort,
        path: '/updateStockData.js'
    };
    return http.request(opt1).then((data) => {
        var args = data.toString();
        if(args !== '{}') {
            return http.request(opt2).then((path) => {
                return [path.toString(), args];
            });
        }
        return [];
    })
}

exports.sendResult = function(data) {
    var postData = JSON.stringify(data);
    var opt = {
        host: config.localHost,
        port: config.localPort,
        path: '/upload',
        method: 'POST',
        data: postData,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }
    return http.request(opt);
}
