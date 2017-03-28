
var config = require('../config');
var utility = require('../utility');
var file = utility.file;
var object = utility.object;
var http = utility.http;
var async = utility.async;
var azure = utility.azureStorage(config.azureUsr);
var path = require('path');
var parallelN = 50;

/**
 * download blobs in a container to local directory
 */
var downloadFromAzure = function(localPath, container) {
    return azure.getBlobList(container).then((result) => {
        var bolbnames = result.map(r => r.name);
        var N = bolbnames.length;
        var i = 0;
        var errorList = [];

        return async.parallel(() => {
            return i < N;
        }, () => {
            var name = bolbnames[i++];
            return azure.getBlobToFile(container, name, path.join(localPath, name)).then(() => {
                console.log('succeed to download ', name);
            }, (err) => {
                console.log('fail to download ', name, '. err: ', err);
                errorList.push(name);
            });
        }, parallelN).then(() => { return errorList; });
    });
}

downloadFromAzure(process.argv[2], process.argv[3].catch((err) => { console.log(err); });
