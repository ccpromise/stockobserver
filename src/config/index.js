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
exports.stockSyncTime = {
    hour: 10,
    minute: 0
};

// db
exports.maxTaskDuration = 30000;
exports.mongoUrl = 'mongodb://localhost:27017/myproject';

// consumer
exports.waitTime = [0, 5000, 10000, 15000, 20000];

// dispatcher
exports.dispatcherHost = '127.0.0.1';
exports.dispatcherPort = 8000;

// azure-storage
exports.azureAccount = 'liuccplay';
exports.azurePwd = 'KAl0k8DrhZen3m+d+LDTY0s9DFqdDadI7sJgP2/brJ7vHHiyzgfJb7Qml3pyf3T1W9coq0bym2oZprEQYd4k5A==';
exports.azureHost = 'liuccplay.blob.core.chinacloudapi.cn';
exports.stockdataContainer = 'stockdata';
exports.defaultContainer = 'stockdata';

// utility-refReplace
exports.defaultRefenceTemplate = {
    'regex': new RegExp(/{{\w+}}/),
    'getRef': function(s) {
        return s.substring(2, s.length-2);
    }
}
