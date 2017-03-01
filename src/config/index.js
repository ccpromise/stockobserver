var process = require('process');

// http
exports.mongoUrl = '';
exports.access_token = 'bf1e63e10264f88d3d44541d4057e00981ced9e6042c19ce02c0b738f471c747';
exports.isFiddler = process.argv.indexOf('-f') > -1;
exports.fiddlerHost = '127.0.0.1';
exports.fiddlerPort = 8888;

// datapvd
exports.bollingerK = 2;

// stockdata
exports.stockDataDir = '../../data';
