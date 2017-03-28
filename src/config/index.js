var process = require('process');

// http
exports.access_token = 'f15e84b1cb72b925d37547a27f08682b3f74c464f93b67bd6864362c88dd47b2';
exports.isFiddler = process.argv.indexOf('-f') > -1;
exports.fiddlerHost = '127.0.0.1';
exports.fiddlerPort = 8888;

// datapvd
exports.bollingerK = 2;

// stockdata
exports.useLocalData = process.argv.indexOf('-l') > -1;
exports.stockDataDir = '/Users/Chenchen/Desktop/GitExplore/stockobserver/data';
exports.stockListUrl = {
    'host': 'stockanalysis.blob.core.chinacloudapi.cn',
    'path': '/newsysstatic/allstocks.txt'
};
exports.updateTime = 'at 10:00am every weekday';
exports.stockSyncTime = {
    hour: 0,
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
exports.produceInterval = 5000;
exports.timeoutInterval = 5000;
exports.maxProcessTs = 30000;

// azure-storage
exports.azureUsr = {
    account: 'liuccplay',
    pwd: 'KAl0k8DrhZen3m+d+LDTY0s9DFqdDadI7sJgP2/brJ7vHHiyzgfJb7Qml3pyf3T1W9coq0bym2oZprEQYd4k5A==',
    host: 'liuccplay.blob.core.chinacloudapi.cn'
}
exports.stockdataContainer = 'stockdata';
exports.defaultContainer = 'stockdata';
exports.stockmetaContainer = 'stockmeta';

// utility-refReplace
exports.defaultRefenceTemplate = {
    'regex': new RegExp(/{{\w+}}/),
    'getRef': function(s) {
        return s.substring(2, s.length-2);
    }
}
