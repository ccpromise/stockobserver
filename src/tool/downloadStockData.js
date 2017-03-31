
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

/**
 * download stock data to local directory
 * invocation sample: node downloadStockData.js './data'
 */
function downloadStockData(localPath) {
    return getStockList().then((list) => {
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

function getStockList() {
    return request({
        host: host,
        path: stockListPath,
    }).then((content) => {
        return content.toString().split(';');
    })
}

function download(list, localPath) {
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

const localDir = process.argv[2];
console.log('start to download stock data to local directory: ', localDir);
downloadStockData(localDir).catch((err) => console.log(err));
