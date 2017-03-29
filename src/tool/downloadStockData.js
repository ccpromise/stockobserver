
const utility = require('../utility');
const file = utility.file;
const request = utility.request;
const async = utility.async;
const path = require('path');
const parallelN = 50;
const maxRetry = 10;

const host = 'stockanalysis.blob.core.chinacloudapi.cn';
const stockDataContainer = 'newsysraw';
const stockListPath = 'newsysstatic/allstocks.txt';

var getStockList = function() {
    return request({
        host: host,
        path: stockListPath,
    }).then((content) => {
        return content.toString().split(';');
    })
}

var download = function(list, localPath) {
    var i = 0;
    var N = list.length;
    var errList = [];

    return async.parallel(() => {
        return i < N;
    }, () => {
        var secID = list[i++];
        var fileName = secID.toLowerCase() + '.json';
        return request({
            host: host,
            path: stockDataContainer + '/' + fileName,
        }).then((data) => {
            return file.writeFile(path.join(localPath, fileName), data);
        }).catch((err) => {
            errList.push(secID);
        });
    }, parallelN).then(() => { return errList; });
}

var downloadStockData = function(localPath) {
    return getStockList().then((list) => {
        console.log(list);
        var remainingList = list;
        var retry = 0;

        return async.doWhile(() => {
            return remainingList.length !== 0 && retry < maxRetry;
        }, () => {
            return download(remainingList, localPath).then((errList) => {
                remainingList = errList;
                retry ++;
                console.log('# of error downloads: ', errList.length);
            })
        }).then(() => console.log('final error list: ', remainingList));
    })
}

downloadStockData(process.argv[2]).catch((err) => console.log(err));
