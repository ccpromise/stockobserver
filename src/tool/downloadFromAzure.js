
const path = require('path');
const azureUsr = require('../config').azureUsr;
const utility = require('../utility');
const async = utility.async;
const azureStorage = utility.azureStorage;
const parallelN = 50;
const maxRetry = 10;

/**
 * download blobs in a container to local directory
 * invocation sample: node downloadFromAzure.js './data' 'stockdata'
 */
function downloadFromAzure(localPath, container) {
    var azure = azureStorage(azureUsr);
    return azure.getBlobList(container).then((list) => {
        var remainingList = list.map(r => r.name);
        var retry = 0;
        async.doWhile(() => {
            return remainingList.length !== 0 && retry <= maxRetry;
        }, () => {
            return download(azure, container, remainingList, localPath).then((errList) => {
                remainingList = errList;
                retry ++;
                console.log('# of err downloads: ', errList.length, '\n try to download again!');
            });
        }).then(() => console.log('final err list: ', remainingList));
    })
}


/**
 * download the blobs in list to local directory
 */
function download(azure, container, list, localPath) {
    var N = list.length;
    var i = 0;
    var errList = [];

    return async.parallel(() => {
        return i < N;
    }, () => {
        var name = list[i++];
        return azure.getBlobToFile(container, name, path.join(localPath, name)).then(() => {
            console.log('succeed to download ', name);
        }, (err) => {
            errList.push(name);
        });
    }, parallelN).then(() => { return errList; });
}

const localPath = process.argv[2];
const azureContainer = process.argv[3];

console.log('local path: ', localPath);
console.log('azure container: ', azureContainer);
console.log('start to download blobs in container to local path...');

downloadFromAzure(process.argv[2], process.argv[3]).catch((err) => { console.log(err); });
