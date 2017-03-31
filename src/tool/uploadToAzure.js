
const path = require('path');
const azureUsr = require('../config').azureUsr;
const utility = require('../utility');
const async = utility.async;
const azureStorage = utility.azureStorage;
const file = utility.file;
const parallelN = 50;
const maxRetry = 10;

/**
 * upload files in local directory to a container
 * invocation sample: node uploadToAzure.js './data' 'stockdata'
 */
function uploadToAzure(localPath, container) {
    const azure = azureStorage(azureUsr);
    return azure.createContainerIfNotExists(container).then(() => {
        file.readDirectory(localPath).then((list) => {
            var remainingList = list;
            var retry = 0;
            async.doWhile(() => {
                return remainingList.length !== 0 && retry <= maxRetry;
            }, () => {
                return upload(azure, container, remainingList, localPath).then((errList) => {
                    remainingList = errList;
                    retry ++;
                    console.log('# of err uploads: ', errList.length, '\n try to upload again!');
                });
            }).then(() => console.log('final err list: ', remainingList));
        })
    })
}

/**
 * upload the files in list to a container
 */
function upload(azure, container, list, localPath) {
    var N = list.length;
    var i = 0;
    var errList = [];

    return async.parallel(() => {
        return i < N;
    }, () => {
        var name = list[i++];
        return azure.createBlobFromFile(container, name, path.join(localPath, name)).then(() => {
            console.log('succeed to upload ', name);
        }, (err) => {
            errList.push(name);
        });
    }, parallelN).then(() => { return errList; });
}

const localDir = process.argv[2];
const container = process.argv[3];
console.log('local directory: ', localDir);
console.log('container: ', container);
console.log('start to upload files in local directory to azure container...');
uploadToAzure(localDir, container).catch((err) => { console.log(err); });
