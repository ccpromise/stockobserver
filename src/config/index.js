var process = require('process');

// http
exports.access_token = '1435e205f9d203055d546b1ed7cc991f7363100bbed9c7bf9a3a0f40c5362a91';
exports.isFiddler = process.argv.indexOf('-f') > -1;
exports.fiddlerHost = '127.0.0.1';
exports.fiddlerPort = 8888;

// datapvd
exports.bollingerK = 2;

// stockdata
exports.stockDataDir = '/Users/Chenchen/Desktop/GitExplore/stockobserver/data';
exports.stockListUrl = {
    'host': 'stockanalysis.blob.core.chinacloudapi.cn',
    'path': '/newsysstatic/allstocks.txt'
};
exports.updateTime = 'at 10:00am every weekday';
exports.stockSyncTime = '20:00';

// db
exports.constants = require('./constants');
exports.maxTaskDuration = 10000;
exports.mongoUrl = 'mongodb://localhost:27017/myproject';
