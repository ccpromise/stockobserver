
var utility = require('../utility');
var path = require('path');
var file = utility.file;
var azure = utility.azureStorage;
var async = utility.async;

// upload directory or file to a container.
exports.uploadFiles = function(localPath, container) {
    return azure.createContainerIfNotExists(container).then(() => {
        return file.stat(localPath).then((stats) => {
            if(stats.isFile()) return azure.createBlobFromFile(container, path.basename(localPath), localPath);
            return uploadDir(localPath, container);
        });
    });
}

var uploadDir = function(localPath, container) {
    return file.readDirectory(localPath).then((filenames) => {
        return async.forEach(filenames, (filename) => {
            var filePath = path.join(localPath, filename);
            return file.stat(filePath).then((stats) => {
                if(stats.isFile()) return azure.createBlobFromText(container, filename, filePath);
                return uploadDir(filePath, container);
            })
        })
    })
}

// download blobs from a container to a directory
exports.getBlobs = function(localPath, container) {
    return azure.getBlobList(container).then((result) => {
        var bolbnames = result.map(r => r.name);
        return async.forEach(bolbnames, (bolbname) => {
            return azure.getBlobToFile(container, bolbname, path.join(localPath, bolbname));
        });
    });
}
