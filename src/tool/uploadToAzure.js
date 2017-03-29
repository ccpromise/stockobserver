
const path = require('path');
const azureUsr = require('../config').azureUsr;
const utility = require('../utility');
const async = utility.async;
const azureStorage = utility.azureStorage;
const file = utility.file;
const parallelN = 50;
const maxRetry = 10;

/**
 * upload the files in list to a container
 */
var upload = function(azure, container, list, localPath) {
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

/**
 * upload files in local directory to a container
 */
var uploadToAzure = function(localPath, container) {
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

uploadToAzure(process.argv[2], process.argv[3]).catch((err) => { console.log(err); });
