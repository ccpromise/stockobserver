
var utility = require('../utility');
var config = require('../config');
var path = require('path');
var file = utility.file;
var azure = utility.azureStorage(config.azureUsr);
var async = utility.async;
var parallelN = 50;

// upload directory or file to a container.
var uploadToAzure = function(localPath, container) {
    container = container || config.defaultContainer;
    return azure.createContainerIfNotExists(container).then(() => {
        return file.stat(localPath).then((stats) => {
            if(stats.isFile()) return azure.createBlobFromFile(container, path.basename(localPath), localPath);
            return uploadDir(localPath, container);
        });
    });
}

var uploadDir = function(localPath, container) {
    return file.readDirectory(localPath).then((filenames) => {
        var N = filenames.length;
        var i = 0;
        var errList = [];

        return azure.getBlobList(container).then((result) => {
            var curList = {};
            result.forEach((r) => { curList[r.name] = true; });

            return async.parallel(() => {
                return i < N;
            }, () => {
                var name = filenames[i++];
                var filePath = path.join(localPath, name);
                if(name in curList) return Promise.resolve();
                return azure.createBlobFromFile(container, name, filePath).then(() => {
                    console.log('succeed to upload ', name);
                }, (err) => {
                    console.log('fail to upload ', name, '. err: ', err);
                    errList.push(name);
                });
            }, parallelN).then(() => { console.log(errList); });
        })
    })
}

uploadToAzure(process.argv[2], process.argv[3]).catch((err) => console.log(err));
