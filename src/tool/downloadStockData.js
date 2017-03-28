
var utility = require('../utility');
var file = utility.file;
var object = utility.object;
var http = utility.http;
var async = utility.async;
var config = require('../config');
var path = require('path');
var parallelN = 50;

var host = 'stockanalysis.blob.core.chinacloudapi.cn';
var stockDataContainer = 'newsysraw';
var stockListPath = 'newsysstatic/allstocks.txt';

var downloadStockData = function(stockDir) {
    return http.request({
        host: host,
        path: stockListPath,
        method: 'GET',
        useHttps: true
    }).then((content) => {
        var all = content.toString().split(';');
        var i = 0;
        var N = all.length;
        var errStockList = [];
        return file.readDirectory(stockDir).then((curList) => {
            var curMap = {};
            curList.forEach((file) => { curMap[file] = true; });
            return async.parallel(() => {
                return i < N;
            }, () => {
                var secID = all[i++];
                var fileName = secID.toLowerCase() + '.json';
                if(fileName in curMap) return Promise.resolve();
                return http.request({
                    host: host,
                    path: stockDataContainer + '/' + fileName,
                    method: 'GET',
                    useHttps: true
                }).then((data) => {
                    return file.writeFile(path.join(stockDir, fileName), data.toString());
                }).catch((err) => { errStockList.push(secID); });
            }, parallelN).then(() => console.log(errStockList));
        })
    })
}

downloadStockData(process.argv[2]).catch((err) => console.log(err));
