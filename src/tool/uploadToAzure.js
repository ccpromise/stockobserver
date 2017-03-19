
var utility = require('../utility');
var config = require('../config');
var path = require('path');
var file = utility.file;
var azure = utility.azureStorage;
var async = utility.async;
var parallelN = 10;

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

        return async.parallel(() => {
            return i < N;
        }, () => {
            var j = i++;
            var filePath = path.join(localPath, filenames[j]);
            return file.stat(filePath).then((stats) => {
                if(stats.isFile()) return azure.createBlobFromText(container, filenames[j], filePath).then(() => {
                    console.log('succeed to upload ', filenames[j]);
                }, (err) => {
                    console.log('fail to upload ', filenames[j], '. err: ', err);
                });
            });
        }, parallelN);
        /*
        return async.forEach(filenames, (filename) => {
            var filePath = path.join(localPath, filename);
            return file.stat(filePath).then((stats) => {
                if(stats.isFile()) return azure.createBlobFromText(container, filename, filePath);
                //return uploadDir(filePath, container);
            })
        })
        */
    })
}

uploadToAzure(process.argv[2], process.argv[3]).catch((err) => console.log(err))
